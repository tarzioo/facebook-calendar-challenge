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
				var getLayer = function(time) {
					return data.reduce(function(layer, current, pos) {
						if(current.start < time && current.end > time) {
							layer.push(pos);
						}
						return layer;
					}, []);
				}, layer, layers = [],i;
				for(i = 0; i < data.length; i++) {
					data[i].columns = data[i].columns || 1;
					data[i].pos = 0;
					for(var time = data[i].start; time <= data[i].end; time++) {
						layer = getLayer(time);
						if(layer.length) {
							layers.push(layer);
						}
						if(data[i].columns < layer.length) {
							data[i].columns = layer.length;
						}
					}
				}

				var key, width, prev;
				for(key in layers) {
					layer = layers[key];

					if(''+prev == ''+layer) {
						continue;
					}

					for(i = 0;i<layer.length;i++) {
						width = maxWidth / data[layer[i]].columns;
						data[layer[i]].width = width;
						data[layer[i]].left = width*i;
						data[layer[i]].pos = data[layer[i]].pos > i? data[layer[i]].pos:i;
					}
					prev = layer;
				}

				for(key in layers) {
					layer = layers[key];
					if(''+prev == ''+layer) {
						continue;
					}
					for(i = 1;i<layer.length;i++) {
						for(var j = i-1; j >= 0; j--) {
							if(data[layer[j]].left == data[layer[i]].left) {
								data[layer[i]].left = data[layer[j]].left + data[layer[j]].width;
								break;
							}
						}
					}
					prev = layer;
				}

				return data;
			},

			format = function(data) {
				return data.map(function(current, index) {
					var left = current.left;//current.width*current.pos;
					return {
						id     : current.id,
						top    : current.start,
						width  : current.width,
						left   : left,
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
