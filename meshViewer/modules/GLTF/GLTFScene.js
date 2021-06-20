import { GLTFUtils } from './GLTFUtils.js';

export class GLTFScene {
	constructor(o) {
		if (!(o.nodes instanceof Array))
			throw new Error('nodes must be an Array.');
		this.name = o.name;
		this.nodes = o.nodes;
	}

	loadNodesFrom(nodes) {
		if (this.nodes.length > 0 && typeof this.nodes[0] === 'object')
			throw new Error('Scene nodes already loaded.');
		this.nodes = this.nodes.map(function(nodeIndex) {
			return nodes[nodeIndex];
		});
	}

	getTrianglePositions(binDataView) {
		var result = [];
		this.nodes.forEach(function(node) {
			var positions = node.getTrianglePositions(binDataView);
			GLTFUtils.addToArray(result, positions);
		});
		return result;
	}
}