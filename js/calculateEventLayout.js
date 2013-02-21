/*jshint loopfunc:true */
// var layOutDay = (function(maxWidth, maxHeight) {
// 		"use strict";
// 		var console = window.console; //jshint :(
// 		var filterAndSort = function(data) {
// 				return data.filter(function(current) {
// 					//validating input
// 					if(current.start === void 0 || current.end === void 0) {
// 						return false;
// 					}

// 					//between boundaries
// 					return current.start >= 0 && current.end >= current.start && current.end <= maxHeight;

// 				}).sort(function(a, b) {
// 					//sorting by start time then by length.
// 					if((a.start - b.start) === 0) {
// 						return b.end - a.end;
// 					} else {
// 						return a.start - b.start;
// 					}
// 				});
// 			},
// 			tree = [{start: 0, end: 720, siblings: []}],
// 			collides = function(node, item) {
// 				return (node.start < item.start && node.end > item.start) || 
// 						(item.start == node.start && item.end == node.end) ||
// 						(item.start == node.start) || (item.end == node.end);
// 			},
			
// 			getSiblings = function(depth) {
// 				for(var i in tree) {
// 					if(tree[i].depth == depth) {
// 						return tree[i].siblings.concat(tree[i]);
// 					}
// 				}
// 				return [];
// 			},

// 			sibilingsCheck = function(item, depth) {
// 				var siblings = getSiblings(depth);

// 				for(var i in siblings) {
// 					if(collides(siblings[i], item) || collides(item, siblings[i])) {
// 						placeInTree(item, siblings[i], depth, true);
// 						return false;
// 					}
// 				}
// 				return true;
// 			},

// 			putUnder = function(node, item, depth) {

// 				item.depth = depth+1;
// 			//	if(sibilingsCheck(item, depth+1)) {
// 					if(node.children) {
// 						node.children.push(item);
// 					} else {
// 						node.children = [item];
// 					}
// 					item.parent = node;
// 					updateSiblings(item, depth+1);
// 					tree.push(item);
// 				//}
// 			},
			
// 			putBesides = function(node, item, depth) {
// 				if(node.parent) {
// 					node.parent.children.push(item);
// 					item.parent = node;
// 				}
// 				item.depth = depth;
// 				updateSiblings(item, depth);
// 				tree.push(item);
// 			},
// 			updateSiblings = function(item, depth) {
// 				item.siblings = tree.reduce(function(list, current) {
// 					if(current.depth == depth) {
// 						current.siblings.push(item)
// 						list.push(current);
// 					}
// 					return list;
// 				}, []);
// 			},

// 			placeInTree = function(item, node, depth, siblingSearch) {
// 				if(collides(node, item)) {
// 					if(node.children) {
// 						for(var i in node.children) {
// 							if(placeInTree(item, node.children[i], depth+1, siblingSearch)) {
// 								return true;
// 							}
// 						}
// 					} else if(node.siblings.length && !siblingSearch) {
// 						for(var j in node.siblings) {
// 							if(placeInTree(item, node.siblings[j], depth, true)) {
// 								return true;
// 							}
// 						}
// 					} 

// 					putUnder(node, item, depth);
// 					return true;
// 				} else {
// 					if(node.siblings.length && !siblingSearch) {
// 						for(var j in node.siblings) {
// 							if(placeInTree(item, node.siblings[j], depth, true)) {
// 								return true;
// 							}
// 						}
// 						putBesides(node, item, depth);
// 						return true;
// 					} 

// 					if(!siblingSearch) {
// 						putBesides(node, item, depth);
// 						return true;
// 					} else {
// 						return false;
// 					}
// 				}
// 				console.log('w00t?');
// 				debugger;
// 			},

// 			scanAndPlace = function(data) {
// 				data.forEach(function(item) {
// 					placeInTree(item, tree[0], -1);
// 				});

// 				console.log(tree);
// 			},

// 			maxSiblings = function() {
// 				tree.forEach(function(current) {
// 					var max = 0, count;
// 					for(var seek = current.start; seek < current.end;seek++) {
// 						count = tree.reduce(function(count, other) {
// 							if(current.id != other.id && other.start < seek && other.end > seek) {
// 								count++;
// 							}
// 							return count;
// 						}, 0);
// 						max = max > count ? max : count;

// 					}
// 					current.maxSiblings = max;
// 					if(current.parent && current.parent.maxSiblings < current.maxSiblings) {
// 						current.parent.maxSiblings = current.maxSiblings;
// 					}
// 				});

// 				tree.forEach(function(current) {
// 					for(var seek = current.start; seek < current.end; seek++) {
// 						current.maxSiblings = tree.reduce(function(count, other) {
// 							if(current.id != other.id && other.start < seek && seek < other.end) {
// 								count = count > other.maxSiblings?count:other.maxSiblings;
// 							}
// 							return count;
// 						}, current.maxSiblings);
// 						if(current.parent && current.parent.maxSiblings < current.maxSiblings) {
// 							current.parent.maxSiblings = current.maxSiblings;
// 						}
// 					}
// 				});
// 			},
// 			format = function() {
// 				tree.shift();
// 				maxSiblings();
// 				return tree.map(function(current, index) {
// 					var width = maxWidth / (current.maxSiblings+1);
// 					return {
// 						id     : current.id,
// 						top    : current.start,
// 						width  : width,
// 						left   : current.depth*width,
// 						start  : current.start,
// 						end    : current.end,
// 						height : current.end - current.start,
// 						//debugging
// 						pos: current.depth,
// 						siblings: current.maxSiblings+1,
// 						index: index
// 					};
// 				});
// 			};

// 		return function(data) {
// 			var sorted = filterAndSort(data);
// 			scanAndPlace(sorted);
// 			return format();
// 		};
// 	}(600, 720)),//maxWidth, maxHeight
var layOutDay = (function(maxHeight, maxWidth) {
	"use strict";
	var tree;
	
	function cloneArray(array) {
		return [].concat(array);
	}

	function updateSiblings(item) {
		item.siblings = tree.reduce(function(siblings, current) {
			if(item.depth == current.depth) {
				siblings.push(current);
				current.siblings.push(item);
			}
			return siblings;
		}, []);
	}

	function append(node, item, depth) {
		item.depth = depth+1;
		updateSiblings(item);

		if(node.children) {
			node.children.push(item);
		} else {
			node.children = [item];
		}

		item.parent = node;
		tree.push(item);
	}

	function collides(node, item) {
		if(item.start > node.start && item.start < node.end) {
			return true;
		} else if((node.start == item.start) || (node.end == item.end)) {
			return true;
		} else {
			return false;
		}
	}

	function iterate(list, item, depth) {
		for(var key in list) {
			if(traverse(list[key], item, depth)) {
				return true;
			}
		}
		return false;
	}

	function traverse(node, item, depth) {
		if(collides(node, item)) { 

			//optimising BFT(sibling search)
			if(node.children[0]) {
				item.siblings = cloneArray(node.children[0].siblings);  
			}

			if(iterate(node.children, item, depth+1)) { //DFT
				return true;
			}
			append(node, item, depth);
			return true;
		} else if(item.siblings.length > 0){ //BFT
			if(traverse(item.siblings.shift(), item, depth)) {
				return true;
			}
		} 
		return false;
	}

	function filterAndSort(data) {
		return data.filter(function(current) {
			//is start and end set
			if(current.start === void 0 || current.end === void 0) {
				return false;
			}
			
			//not too big.
			if(current.end > maxHeight) {
				return false;
			}

			//not reverse.
			if(current.start >= current.end) {
				return false;
			}
			
			//not less than zero, no need to check end
			//allready validated its not passing start.
			if(current.start < 0) {
				return false;
			}

			//all fine
			return true;

		}).sort(function(a, b) {
			//sorting by start time then by length.
			if((a.start - b.start) === 0) {
				return b.end - a.end;
			} else {
				return a.start - b.start;
			}
		});
	}

	function prepare(data) { 
		return filterAndSort(data).map(function(current) {
			return {
				id       : current.id,
				start    : current.start,
				end      : current.end,
				
				children : [],
				siblings : [],
				
				depth    : 0,
				maxDepth : 0,
			}
		});
	}
	
	function setMaxDepth() {
		//only need the leaves
		var leaves = tree.filter(function(current) {
			return current.children.length == 0;
		}), maxDepth;

		//trasversing first time to propogate to the roots (current.depth).
		leaves.forEach(function(leaf) {
			var current = leaf, maxDepth = 0;
			while(current.parent) {
				maxDepth = maxDepth > current.depth ? maxDepth : current.depth;
				current = current.parent; 
			}

			current = leaf;
			
			while(current.parent) {
				current.maxDepth = maxDepth;
				current = current.parent; 
			}
		});

		//trasversing second time to propogate FROM roots (current.maxDepth).
		leaves.forEach(function(leaf) {
			var current = leaf, maxDepth = leaf.maxDepth;
			while(current.parent) {
				maxDepth = maxDepth > current.maxDepth ? maxDepth : current.maxDepth;
				current = current.parent; 
			}

			current = leaf;
			
			while(current.parent) {
				current.maxDepth = maxDepth;
				current = current.parent; 
			}
		});
	}

	//format data for result
	function format(tree) {
		return tree.map(function(item) {
			var width = maxWidth / (item.maxDepth+1),
				left  = width * item.depth;

			return {
				id     : item.id,
				start  : item.start,
				end    : item.end,
				top    : item.start,
				left   : left,
				width  : width,
				height : item.end - item.start
			};
		});
	}

	function initialzeTree() {
		return [
			{ // creating root element.
				id       : 'root',
				start    : 0, 
				end      : 720,
				depth    : -1, 
				children : [], 
				siblings : []
			}
		];
	}

	function populate(input) {
		//just initializing tree.
		tree = initialzeTree(); 

		//filtering, sorting, initializing default values.
		input = prepare(input); 
		
		//this is the root element which is later disposed.
		var root = tree[0]; 

		input.forEach(function(item) { 
			//actual search and place action.
			traverse(tree[0], item, -1);
		});

		//setting maximum depth across tree, later used to determine placement(flatten).
		setMaxDepth(); 

		//dispose of root.
		tree.shift();

		//format to expected data structure.
		return format(tree); 
	}
	
	//the actual encapsulation function that is returned and layOutDay is set to
	return function(input) { 
		return populate(input);
	};
}(720, 600));