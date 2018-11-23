$(document).ready(function() {

    $('[data-action=show-popup]').click(function() {

        $('[data-class=popup]').hide();

        var id = $(this).attr('data-id');
        var popup = $('[data-class=popup][data-id='+id+']');
        popup.fadeIn();
        $('body').css('overflow','hidden');

        return false

    });

    $('[data-action=hide-popup]').click(function() {

        var id = $(this).attr('data-id');
        var popup = $('[data-class=popup][data-id='+id+']');
        popup.fadeOut();
        $('body').css('overflow','auto');

        return false;

    });
});

var rand = function(min/* max */, max) {
    return Math.floor(arguments.length > 1 ? (max - min + 1) * Math.random() + min : (min + 1) * Math.random());
};

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var showSystemMessage = function(messages,style,time) {

    var list = '';
    messages.forEach(function(i) {
        list = list + '<div>'+i+'</div>';
    });

    var view = '<div class="alert '+style+'"><button type="button" class="close" data-dismiss="alert">&times;</button>'+list+'</div>';

    $('[data-class=container][data-id=system-messages]').html(view);

    if(time) {
        setTimeout(function() {
            hideSystemMessage();
        }, time);
    }

}
var hideSystemMessage = function() {
    $('[data-class=container][data-id=system-messages]').html('');
}