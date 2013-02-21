(function() {
	var addEvents = function(target, events) {
		//clear html, remove() is used instead of html(''), to remove safely from dom.
		target.children().remove();
		layOutDay(events).forEach(function(event, id) {
			var wrapper = $('<div>').addClass('event').css({
				top    : event.top    + 'px',
				left   : event.left   + 'px',
				width  : event.width  + 'px',
				height : event.height + 'px'
			}).attr('id', 'node-'+id);
			$('<dl><dt>Sample item</dt><dd>Sample location</dd></dl>').appendTo(wrapper);
			wrapper.appendTo(target);
		});
	};

	$(function() {
	    addEvents($('.events-wrapper'), [
	        {id:  0, start: 30, end: 150},
	        {id:  1, start: 540, end: 600},
	        {id:  2, start: 560, end: 620},
	        {id:  3, start: 610, end: 670}
	    ]);
	});

     $(function() {
        addEvents($('.events-wrapper'), [
            {id: 0, start: 100, end: 300},
            {id: 1, start: 150, end: 400},
            {id: 2, start: 160, end: 350},
            {id: 3, start: 400, end: 600},
            {id: 4, start: 400, end: 600},
            {id: 5, start: 400, end: 600},
            {id: 6, start: 410, end: 600},
            {id: 7, start: 0, end: 600},
            {id: 8, start: 420, end: 600},
            {id: 9, start: 0, end: 360},
            {id: 10, start: 0, end: 150},
            {id: 11, start: 20, end: 360},
            {id: 12, start: 20, end: 360},
            {id: 13, start: 600, end: 720},
            {id: 14, start: 600, end: 660},
            {id: 15, start: 660, end: 720},
            {id: 16, start: 600, end: 720},
        ]);
    });
}());
