;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

function RS(target, event, vertical) {

    event = event || {};

    var win = window,
        doc = document,
        ranger = doc.createElement('div'),
        dragger = doc.createElement('span'),
        sizeshower = doc.createElement('div'),
        drag = false,
        rangerSize = 0,
        draggerSize = 0,
        rangerDistance = 0,
        cacheValue = 0,
        vertical = vertical || event.vertical || false,
        size = vertical ? 'offsetHeight' : 'offsetWidth',
        css = vertical ? 'top' : 'left',
        page = vertical ? 'pageY' : 'pageX',
        offset = vertical ? 'offsetTop' : 'offsetLeft',
        client = vertical ? 'clientY' : 'clientX',
        scroll = vertical ? 'scrollTop' : 'scrollLeft';

    function isSet(x) {
        return typeof x !== "undefined";
    }

    function isFunc(x) {
        return typeof x === "function";
    }

    function getCoordinate(el) {
        var x = el[offset];
        while (el = el.offsetParent) {
            x += el[offset];
        }
        return x;
    }

    function on(ev, el, fn) {
        if (el.addEventListener) {
            el.addEventListener(ev, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + ev, fn);
        } else {
            el['on' + ev] = fn;
        }
    }

    function off(ev, el, fn) {
        if (el.removeEventListener) {
            el.removeEventListener(ev, fn);
        } else if (el.detachEvent) {
            el.detachEvent('on' + ev, fn);
        } else {
            el['on' + ev] = null;
        }
    }

    function addClass(s, el) {
        if (el.classList) {
            el.classList.add(s);
        } else {
            el.className += ' ' + s;
        }
    }

    addClass('range-slider', target);
    addClass('range-slider-' + (vertical ? 'vertical' : 'horizontal'), target);
    addClass('range-slider-track', ranger);
    addClass('dragger', dragger);
    addClass('range-size-shower', sizeshower);

    // `RS(target, function(a, b, c) {})`
    if (isFunc(event)) {
        event = {
            drag: event
        };
    }

    function edge(a, b, c) {
        if (a < b) return b;
        if (a > c) return c;
        return a;
    }

    function preventDefault(e) {
        if (e.preventDefault) e.preventDefault();
        return false;
    }

    function setSize() {
        rangerSize = ranger[size];
        rangerDistance = getCoordinate(ranger);
        draggerSize = dragger[size];
    }

    function dragInit() {
        cacheValue = edge(isSet(event.value) ? event.value : 0, 0, 100);
        dragger.style[css] = (((cacheValue / 100) * rangerSize) - (draggerSize / 2)) + 'px';
        sizeshower.style.width = (((cacheValue / 100) * rangerSize))  + 'px';
        if (isFunc(event.create)) event.create(cacheValue, target);
        if (isFunc(event.drag)) event.drag(cacheValue, target);
    }

    function dragStart(e) {
        setSize(), drag = true, dragUpdate(e);
        on("touchmove", doc, dragMove);
        on("mousemove", doc, dragMove);
        if (isFunc(event.start)) event.start(cacheValue, target, e);
        return preventDefault(e);
    }

    function dragMove(e) {
        dragUpdate(e);
        return preventDefault(e);
    }

    function dragStop(e) {
        drag = false;
        off("touchmove", doc, dragMove);
        off("mousemove", doc, dragMove);
        if (isFunc(event.stop)) event.stop(cacheValue, target, e);
        return preventDefault(e);
    }

    function dragUpdate(e) {
        e = e || win.event;
        var pos = e.touches ? e.touches[0][page] : e[page],
            move = edge(pos - rangerDistance, 0, rangerSize),
            value = edge(((pos - rangerDistance) / rangerSize) * 100, 0, 100);
        if (!pos) pos = e[client] + doc.body[scroll] + doc.documentElement[scroll];
        if (drag) {
            dragger.style[css] = (move - (draggerSize / 2)) + 'px';
            cacheValue = Math.round(value);
            sizeshower.style.width = move + 'px';
            if (isFunc(event.drag)) event.drag(cacheValue, target, e);
        }
    }

    on("touchstart", ranger, dragStart);
    on("mousedown", ranger, dragStart);

    on("touchend", doc, dragStop);
    on("mouseup", doc, dragStop);

    on("resize", win, function(e) {
        setSize(), drag = false;
        dragger.style[css] = (((cacheValue / 100) * rangerSize) - (draggerSize / 2)) + 'px';
        sizeshower.style.width = (((cacheValue / 100) * rangerSize))  + 'px';
    });

    ranger.appendChild(dragger);
    target.appendChild(ranger);
    ranger.appendChild(sizeshower);

    return setSize(), dragInit(), target;

}