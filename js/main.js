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