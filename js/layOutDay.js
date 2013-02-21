var layOutDay = (function(maxHeight, maxWidth) {
	"use strict";
	var tree;
	// Siblings container wrapper
	var siblingIndex = {
		index: {},
		clear: function() {
			this.index = {};
		},
		
		add: function(node) {
			//if first in list, create array
			var level = this.index[node.depth] || (this.index[node.depth] = []);
			level.push(node);
		}, 

		get: function(depth) {
			//return siblings or empty array
			return this.index[depth] || [];
		}
	};

	//just a helper function, returns a fresh array instead of a mutable
	function cloneArray(array) {
		return [].concat(array);
	}

	//updating sibling search
	function updateSiblings(item) {
		siblingIndex.add(item);
	}

	//add new node to tree
	function append(node, item, depth) {
		//increase depth.
		item.depth = depth+1;
		
		//update all sibling nodes
		updateSiblings(item);

		//add to nodes childre
		node.children.push(item);

		//set parent.
		item.parent = node;

		//add to lookup table
		tree.push(item);
	}

	function overlaps(node, item) {
		if(item.start > node.start && item.start < node.end) {
		//  _
		// | | _
		// |_|| |
		//    |_|
			return true;
		} else if((node.start == item.start) || (node.end == item.end)) {
		//  _  _      _         _  _
		// | || | OR | | _  OR | || | 
		// |_|| |    | || |    | || | 
		//    |_|    |_||_|    |_||_| 
			return true;
		} else {
			// doesn't overlap
			return false;
		}
	}

	//helper function to iterate over a list of nodes
	function iterate(list, item, depth) {
		for(var key in list) {
			if(traverse(list[key], item, depth)) {
				return true;
			}
		}
		return false;
	}

	// returns true on successful tree placement
	function traverse(node, item, depth) {
		if(overlaps(node, item)) { 					
			if(iterate(node.children, item, depth+1)) { //DFT
				return true;
			}

			var siblings = siblingIndex.get(depth+1);
			if(iterate(siblings, item, depth+1)) { //BFT
				return true;
			}
	
			append(node, item, depth);
			return true;
		}
		return false;
	}

	// filter and sort the raw data
	function filterAndSort(data) {
		return data.filter(function(item) {
			//is start and end set
			if(item.start === void 0 || item.end === void 0) {
				return false;
			}
			
			//not out of bounds.
			if(item.end > maxHeight) {
				return false;
			}

			//not reverse.
			if(item.start >= item.end) {
				return false;
			}
			
			//not less than zero, no need to check end
			//already validated its not passing start.
			if(item.start < 0) {
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

	//prepare each node for tree.
	function prepare(data) { 
		return filterAndSort(data).map(function(node) {
			return {
				id       : node.id,
				start    : node.start,
				end      : node.end,
				height   : node.end - node.start,
				width    : 0,
				//helpers
				children : [],
				depth    : 0,
				maxDepth : 0
			}
		});
	}
	
	//set width of each node
	function setWidths() {
		//Only need the leaves from the lookup table
		var leaves = tree.filter(function(node) {
			return node.children.length == 0;
		}), maxDepth;

		//Trasversing first time to propogate to the roots (node.depth)
		leaves.forEach(function(leaf) {
			var node = leaf, maxDepth = 0;
			while(node.parent) {
				maxDepth = maxDepth > node.depth ? maxDepth : node.depth;
				node = node.parent; 
			}

			node = leaf;
			
			while(node.parent) {
				node.maxDepth = maxDepth;
				node = node.parent; 
			}
		});

		//Trasversing second time to propogate FROM roots (node.maxDepth)
		leaves.forEach(function(leaf) {
			var node = leaf, maxDepth = leaf.maxDepth;
			while(node.parent) {
				maxDepth = maxDepth > node.maxDepth ? maxDepth : node.maxDepth;
				node = node.parent; 
			}

			node = leaf;
			
			while(node.parent) {
				node.maxDepth = maxDepth;
				node = node.parent; 
			}
		});

		//Third time to deal with reverse-overlaping nodes
		//Example:
		// _
		//| | _
		//|_|| |
		// _ | |
		//| ||_|
		//|_|
		leaves.forEach(function(leaf) {
			var depth    = leaf.maxDepth+1;
			var siblings = siblingIndex.get(depth);

			while(siblings.length > 0) {
				for(var index in siblings) {
					if(overlaps(siblings[index], leaf)) {
						leaf.maxDepth = siblings[index].maxDepth;
						return;
					}
				}
				siblings = siblingIndex.get(++depth);
			}
		});

		//setting width for each node
		tree.forEach(function(node) {
			node.width = maxWidth / (node.maxDepth+1);
		}); 
	}

	//format data for result
	function format(tree) {
		return tree.map(function(node) {
			return {
				id     : node.id,
				start  : node.start,
				end    : node.end,
				top    : node.start,
				left   : node.width * node.depth,
				width  : node.width,
				height : node.height
			};
		});
	}

	function initialzeTree() {
		return [
			{ //creating root element
				id       : 'root',
				start    : 0, 
				end      : 720,
				depth    : -1, 
				children : []
			}
		];
	}

	function populate(input) {
		//just initializing tree
		tree = initialzeTree(); 

		//clearing sibling index
		siblingIndex.clear();
		
		//filtering, sorting, initializing default values
		input = prepare(input); 
		
		//this is the root node which is later disposed
		var root = tree[0]; 

		//actual search and place
		input.forEach(function(item) { 
			traverse(tree[0], item, -1);
		});

		//setting width for each node
		setWidths(); 

		//dispose of root.
		tree.shift();

		//format to expected data structure
		return format(tree); 
	}
	
	//the actual encapsulation function that is returned and layOutDay is set to
	return function(input) { 
		return populate(input);
	};
}(720, 600));