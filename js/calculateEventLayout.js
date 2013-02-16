var layOutDay = (function(maxWidth, maxHeight) {
	"use strict";
	var sort = function(data) {
			return data.filter(function(current) {
				return current.end >= current.start;
			}).sort(function(a, b) {
				return a.start - b.start !== 0 ? a.start - b.start : b.end - a.end;
			});
		},
		getMembers = function(data, time) {
			return data.reduce(function(list, current, index) {
				if(current.start <= time && current.end >= time) {
					list.push(index);
				}
				return list;
			}, []);
		},
		prev,
		place = function(data, time) {
			var members = getMembers(data, time),
				siblings = members.length;

			if(prev == members.join() || siblings === 0) {
				return;
			}

			prev = members.join();

			members.forEach(function(current, index) {
				data[current].pos = index;
				if(!data[current].siblings || siblings > data[current].siblings) {
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
				var width = maxWidth / current.siblings;
				return {
					id    : current.id,
					top   : current.start,
					width : width,
					left  : width * current.pos,
					start : current.start,
					end   : current.end
				};
			});
		};

	return function(data) {
		var sorted = sort(data);
		scanAndPlace(sorted);
		return format(sorted);
	};
}(600, 720)),//maxWidth, maxHeight
addEvents  = function(target, events) {

};
