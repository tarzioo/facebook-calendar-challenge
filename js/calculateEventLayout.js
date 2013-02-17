/*jshint loopfunc:true*/
var layOutDay = (function(maxWidth, maxHeight) {
		"use strict";
		var console = window.console;
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

			collides = function(current, other) {
				return other.start < current.start && other.end > current.start;
			},
			scanAndPlace = function(data) {
				var columns = data.length;
				data = data.map(function(current, index) {
					current.pos = 0;
					current.columns = 1;
					return current;
				});
				var maxColumns = function(siblings) {
					return siblings.reduce(function(max, current) {
						return max > (data[current].columns || 0) ? max : data[current].columns;
					}, 0);
				}, maxPos = function(siblings) {
					return siblings.reduce(function(max, current) {
						return max > (data[current].pos || 0) ? max : data[current].pos;
					}, 0);
				};
				var siblings;
				for(var i = 0; i<=720;i++) {
					siblings = data.reduce(function(all, current, index) {
						if(current.start < i && current.end > i) {
							all.push(index);
						}
						return all;
					}, []);
					columns = siblings.length;
					if(siblings.length > 1) {
						siblings.forEach(function(current, pos) {
							data[current].columns  = maxColumns(siblings) > columns ? maxColumns(siblings) : columns;
							data[current].pos  = pos;
						});
					}
				}
				for(i = 720; i>=1;i--) {
					siblings = data.reduce(function(all, current, index) {
						if(current.start < i && current.end > i) {
							all.push(index);
						}
						return all;
					}, []);
					columns = siblings.length;
					if(siblings.length > 1) {
						siblings.forEach(function(current, pos) {
							data[current].columns = maxColumns(siblings) > columns ? maxColumns(siblings) : columns;
							data[current].pos = pos;
						});
					}

				}


				return data;
			},

			format = function(data) {
				return data.map(function(current, index) {
					var width = current.columns === 0 ? maxWidth : maxWidth / current.columns;
					return {
						id     : current.id,
						top    : current.start,
						width  : width,
						left   : width * current.pos,
						start  : current.start,
						end    : current.end,
						height : current.end - current.start,
						pos: current.pos,
						siblings: current.columns,
						index: index
					};
				});
			};

		return function(data) {
			var sorted = filterAndSort(data);
			var result = scanAndPlace(sorted);
			return format(result);
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
			$('<dl>').append('<dt>'+event.id+':i:'+event.index+'Sample item</dt><dd>Sample location start:'+event.start+', end:'+event.end+', pos:'+event.pos+', columns:'+event.siblings+'</dd>').appendTo(wrapper);

			wrapper.appendTo(target);
		});

	};
