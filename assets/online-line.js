var events = [
    {
        id: 1,
        event: '1L75eRMgeCwA1njcFkk9ncjlm... already received  <strong>0.73 BTC</strong>'
    },
    {
        id: 2,
        event: '38QJyLm3T3RBlanksgPinkAdk... already received  <strong>0.24 BTC</strong>'
    },
    {
        id: 3,
        event: '12Bpv5JMu54M6csk8HgjFjnkk... already received  <strong>0.15 BTC</strong>'
    },
    {
        id: 4,
        event: '1DJ569D5GThrs3jnKhbjdpnfV... already received  <strong>0.33 BTC</strong>'
    },
    {
        id: 5,
        event: '1GJTUkifN77NHjgbGhjnjHkkm... already received  <strong>0.89 BTC</strong>'
    },
    {
        id: 6,
        event: '1Kis54NgtcL6QKhnckaSdbfkd... already received  <strong>0.15 BTC</strong>'
    },
    {
        id: 7,
        event: '1GRGoYLjBgC6P3xJcjkjkcBjkx... already received  <strong>0.55 BTC</strong>'
    },
    {
        id: 8,
        event: '1BcAQzuTiVjQ4cchbkTlndJnlc... already received  <strong>0.32 BTC</strong>'
    },
    {
        id: 9,
        event: '1BcAQzuTiVjQ4dbjsUcnschhJl... already received  <strong>0.71 BTC</strong>'
    },
    {
        id: 10,
        event: '162Y7fTjEYz2pEhgdnLbhk8Bhh... already received  <strong>2.5 BTC</strong>'
    },
    {
        id: 11,
        event: '16WNX75dthpzvWkkbedRmmlnfn... already received  <strong>0.25 BTC</strong>'
    },
    {
        id: 12,
        event: '1BcAQzuTiVjQ41jlfcDn5NghnG... already received  <strong>0.22 BTC</strong>'
    },
    {
        id: 13,
        event: '1NfRKpHGe5wxdSYhgFGhbFhnk6... already received  <strong>0.67 BTC</strong>'
    },
    {
        id: 14,
        event: '1F9WHWVtk9WRUE6Hhhfnfmnfhm... already received  <strong>1.42 BTC</strong>'
    },
    {
        id: 15,
        event: '1BcAQzuTiVjQ41q5gBGfhngfJj... already received  <strong>0.80 BTC</strong>'
    },
    {
        id: 16,
        event: '35AUTmGXcxPthoVp1ghhGjghkn... already received  <strong>0.18 BTC</strong>'
    },
    {
        id: 17,
        event: '1NQgMT2T3HXp1D1j0JBdhbfTjh... already received  <strong>0.44 BTC</strong>'
    },
    {
        id: 18,
        event: '1EMb6UJpbHWGEdFKNgdjkhdn5j... already received  <strong>0.99 BTC</strong>'
    },
    {
        id: 19,
        event: '1F3P3VWZ1wENpyWdhjfRbj3gkh... already received  <strong>0.28 BTC</strong>'
    },
    {
        id: 20,
        event: '1ETyWQB46v5du4vkGEljgY7Fje... already received  <strong>0.58 BTC</strong>'
    },
    {
        id: 21,
        event: '1B7rMzEpQkCBBCVaprJbgjh3hk... already received  <strong>2.5 BTC</strong>'
    },
    {
        id: 22,
        event: '1AxzpDGmBqShVr8ArR8bgnjFhn... already received  <strong>0.15 BTC</strong>'
    },
    {
        id: 23,
        event: '1JupqDhbrZ71UNdEYkZ2BgnFhn... already received  <strong>0.19 BTC</strong>'
    },
    {
        id: 24,
        event: '1Ach3YkismEHedCo6g6Cnb5gkc... already received  <strong>0.73 BTC</strong>'
    },
    {
        id: 25,
        event: '15pvTyB4QzuEf4DxBmPghbRvls... already received  <strong>0.26 BTC</strong>'
    },
    {
        id: 26,
        event: '17LMV58areHGtWkoqNPKRgbgdj... already received  <strong>0.34 BTC</strong>'
    },
    {
        id: 27,
        event: '1KUCGakzJJH3JESy8bkrUYfsmj... already received  <strong>1.22 BTC</strong>'
    },
    {
        id: 28,
        event: '1KUCGakzJJH3JESy8bkrDtlhnf... already received  <strong>0.39 BTC</strong>'
    },
    {
        id: 29,
        event: '1CyzzaKiHUbZa9KauWmNFhjjnx... already received  <strong>0.72 BTC</strong>'
    },
    {
        id: 30,
        event: '3BbX7WwwLiQyJALLL22nAgmcdY... already received  <strong>0.19 BTC</strong>'
    },
    {
        id: 31,
        event: '1Pg94eiHcmSFr3QLsjW5jgEgb... already received  <strong>1.85 BTC</strong>'
    },
    {
        id: 32,
        event: '1LPHQ1MYUkJnoCb646NphThkv... already received  <strong>0.82 BTC</strong>'
    },
    {
        id: 33,
        event: '1KwcGn5RP5k3e1VD92cmKngRh... already received  <strong>2.5 BTC</strong>'
    }
    
]
var eventsContainer = null;

$(document).ready(function() {
    eventsContainer = $('[data-class=container][data-id=online-events]')

    var curEventId = $.jStorage.get('curEventId');
    if(curEventId == null) {
        curEventId = 0;
    }

    setTimeout(startEvents,rand(1000,5000));

});

var startEvents = function() {

    curEventId = $.jStorage.get('curEventId');
    nextEventId = curEventId+1;
    $.jStorage.set('curEventId',nextEventId);
    var event = getEvent(nextEventId);

    if(event !== null) {
        addEvent(event.event);
    } else {
        $.jStorage.set('curEventId',0);
    }

    setTimeout(startEvents,rand(5000,10000));

}

var getEvent = function(eventId) {

    var event = null;

    $.each(events,function() {
        if(this.id == eventId) {
            event = this;
        }
    })

    return event;


}

var addEvent = function(text) {

    eventsContainer.find('.fa-spinner').css('opacity',0);

    var newEventHtml = '<div class="event"><span class="time">' +  moment().format('HH:mm:ss')+ '</span> ' +text+' <i class="fa fa-spinner fa-pulse" style="opacity: 0"></i> </div>';

    eventsContainer.css('top','-30px');
    eventsContainer.prepend(newEventHtml);
    eventsContainer.animate({
        top: '0px'
    },1000,function() {
        var oldEvent = $('.event').last();
        oldEvent.remove();
        eventsContainer.css('top','0px');
        eventsContainer.find('.fa-spinner').css('opacity',1);
    });


}