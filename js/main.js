(function() {
	var addEvents = function(target, events) {
		layOutDay(events).forEach(function(event) {
			var wrapper = $('<div>').addClass('event').css({
				top    : event.top    + 'px',
				left   : event.left   + 'px',
				width  : event.width  + 'px',
				height : event.height + 'px'
			});
			$('<dl><dt>Sample item</dt><dd>Sample location</dd></dl>').appendTo(wrapper);
			wrapper.appendTo(target);
		});
	};

	$(function() {
	    addEvents($('.events-wrapper'), [
	        {id:  0, start: 30, end: 150},
	        {id:  1, start: 540, end: 600},
	        {id:  2, start: 560, end: 620},
	        {id:  3, start: 610, end: 670},
	    ]);
	});
}());
	