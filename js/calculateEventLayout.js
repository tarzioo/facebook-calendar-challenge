var layOutDay = (function(maxHeight, maxWidth) {
	"use strict";
	var tree;
	//siblings indexed by depth
	var siblingIndex = {};

	//just a helper function, returns a fresh array instead of a mutable.
	function cloneArray(array) {
		return [].concat(array);
	}

	//updating sibling search.
	function updateSiblings(item) {
		var siblings = siblingIndex[item.depth] || (siblingIndex[item.depth] = []);
		siblings.push(item);
	}

	//add new node to tree
	function append(node, item, depth) {
		//increace depth.
		item.depth = depth+1;
		
		//delete tmp siblings from item
		delete item.siblings

		//update all sibling nodes.
		updateSiblings(item);

		//add to nodes childre.
		node.children.push(item);

		//set parent.
		item.parent = node;

		//add to lookup table.
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
			// doesn't overlap.
			return false;
		}
	}

	//helper function to iterate over a list of nodes.
	function iterate(list, item, depth) {
		for(var key in list) {
			if(traverse(list[key], item, depth)) {
				return true;
			}
		}
		return false;
	}

	// returns true on successful tree placement.
	function traverse(node, item, depth) {
		if(overlaps(node, item)) { 
			
			//for BFT
			item.siblings = cloneArray(siblingIndex[depth+1] || []);  

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

	function prepare(data) { 
		//prepearing each node for tree.
		return filterAndSort(data).map(function(node) {
			return {
				id       : node.id,
				start    : node.start,
				end      : node.end,
				
				children : [],
				siblings : [],
				
				depth    : 0,
				maxDepth : 0,
			}
		});
	}
	
	function setMaxDepth() {
		//only need the leaves
		var leaves = tree.filter(function(node) {
			return node.children.length == 0;
		}), maxDepth;

		//trasversing first time to propogate to the roots (node.depth).
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

		//trasversing second time to propogate FROM roots (node.maxDepth).
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
	}

	//format data for result
	function format(tree) {
		return tree.map(function(node) {
			var width = maxWidth / (node.maxDepth+1),
				left  = width * node.depth;

			return {
				id     : node.id,
				start  : node.start,
				end    : node.end,
				top    : node.start,
				left   : left,
				width  : width,
				height : node.end - node.start
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

		//clearing sibling index
		siblingIndex = {};
		
		//filtering, sorting, initializing default values.
		input = prepare(input); 
		
		//this is the root node which is later disposed.
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