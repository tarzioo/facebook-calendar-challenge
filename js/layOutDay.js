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

	//add new node to tree
	function append(node, item, depth) {
		//increase and set depth
		item.depth = depth+1;

		//add item to siblingIndex
		siblingIndex.add(item);

		//add to nodes children
		node.children.push(item);

		//set parent.
		item.parent = node;

		//add to lookup table
		tree.push(item);
	}

	function overlaps(node, item) {
		if(item.start >= node.start && item.start < node.end) {
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

			//* Idealy for large sets checking children first would be much faster,                 *
			//* but then filtering children from siblings is nessesary which is adding complexity.  *

			//BFT (siblings)
			if(iterate(siblingIndex.get(depth+1), item, depth+1)) {
				return true;
			}

			//in case where no siblings overlap,
			//append the item under the current node.
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

	//find max depth for each tree branch
	function setMaxDepth() {
		// visit and set maxDepth on all of node's children
		var setChildren = function(node, depth) {
			node.maxDepth = Math.max(node.maxDepth, depth);
			node.children.forEach(function(child) {
				setChildren(child, depth);
			});
		};

		//Only need the leaves from the lookup table
		var leaves = tree.filter(function(node) {
			return node.children.length == 0;
		});

		//visit every leaf, find maxDepth, reach parent and set children
		leaves.forEach(function(leaf) {
			var node = leaf, maxDepth = 0;
			while(1) {
				maxDepth = Math.max(maxDepth, node.depth);
				if(node.parent.depth >= 0) {
					//next node is not the root node
					node = node.parent;
				} else {
					//reached root node
					setChildren(node, maxDepth);
					break;
				}
			}
		});

		//Covering a case of reverse-overlapping nodes
		//Example:
		// ___           ___
		//| z | ___     | z | ___
		//|___|| y |    |___|| y |
		// ____|___| =>  ___ |   |
		//| x      |    | x ||___|
		//|________|	|___|
		//
		tree.forEach(function(leaf) {
			var nextDepth = leaf.maxDepth+1;
			var siblings  = siblingIndex.get(nextDepth);

			while(siblings.length > 0) {
				for(var index in siblings) {
					if(overlaps(siblings[index], leaf)) {
						leaf.maxDepth = siblings[index].maxDepth;
					}
				}
				siblings = siblingIndex.get(++nextDepth);
			}
		});
	}

	//set width of each node
	function setWidths() {

		//finding max depth.
		setMaxDepth()

		//calculate and set width for each node
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

	function initialiseTree() {
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

	//layOutDay
	return function (input) {
		//initialising tree
		tree = initialiseTree();

		//clearing sibling index
		siblingIndex.clear();

		//filtering, sorting, initializing default values
		input = prepare(input);

		//this is the root node which is later disposed
		var root = tree[0];

		//actual search and place
		input.forEach(function(item) {
			traverse(root, item, -1);
		});

		//setting width for each node
		setWidths();

		//dispose of root.
		tree.shift();

		//format to expected data structure
		return format(tree);
	}
}(720, 600));