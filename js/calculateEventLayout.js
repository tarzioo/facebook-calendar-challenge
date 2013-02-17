var layOutDay = (function(maxWidth, maxHeight) {
		"use strict";
		var filterAndSort = function(data) {
				return data.filter(function(current) {
					//validating input
					if(current.start === void 0 || current.end === void 0) {
						return false;
					}

					//between boundaries
					return current.start >= 0 && current.end >= current.start;

				}).sort(function(a, b) {
					//sorting by start time then by length.
					if((a.start - b.start) === 0) {
						return b.end - a.end;
					} else {
						return a.start - b.start;
					}
				});
			},
			getMembers = function(data, time) {
				return data.reduce(function(list, event, index) {
					//checks if time is between the event range
					if(time > event.start && event.end > time) {
						list.push(index);
					}
					return list;
				}, []);
			},
			prev,
			place = function(data, time) {
				var members  = getMembers(data, time),
					siblings = members.length;

				if(prev == members.join() || siblings === 0) {
					return;
				}
				prev = members.join();

				members.forEach(function(current, index) {
					data[current].pos = index;
					if(data[current].siblings === void 0 || siblings > data[current].siblings) {
						data[current].siblings = siblings;
					}
				});
			},

			scanAndPlace = function(data) {
				for(var time = 0; time <= maxHeight; time++) {
					place(data, time);
				}
				prev = void 0; //clean prev in case called multiple times.
			},

			format = function(data) {
				return data.map(function(current) {
					var width = current.siblings === 0 ? maxWidth : maxWidth / current.siblings;
					return {
						id     : current.id,
						top    : current.start,
						width  : width,
						left   : width * current.pos,
						start  : current.start,
						end    : current.end,
						height : current.end - current.start,
						pos: current.pos,
						siblings: current.siblings
					};
				});
			};

		return function(data) {
			var sorted = filterAndSort(data);
			scanAndPlace(sorted);
			return format(sorted);
		};
	}(600, 720)),//maxWidth, maxHeight
	addEvents  = function(target, events) {
		layOutDay(events).forEach(function(event) {
			var wrapper = $('<div>').addClass('event').css({
				top    : event.top    + 'px',
				left   : event.left   + 'px',
				width  : event.width  + 'px',
				height : event.height + 'px'
			});
			$('<dl>').append('<dt>Sample item:'+event.id+'</dt><dd>Sample location start:'+event.start+', end:'+event.end+', pos:'+event.pos+', siblings:'+event.siblings+'</dd>').appendTo(wrapper);

			wrapper.appendTo(target);
		});

	};
