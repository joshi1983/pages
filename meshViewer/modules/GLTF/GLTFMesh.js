import { GLTFAccessor } from './GLTFAccessor.js';
import { GLTFUtils } from './GLTFUtils.js';

export class GLTFMesh {
	constructor(o) {
		this.name = o.name;
		this.primitives = o.primitives;
	}

	_loadAccessorsOn(root, accessors, key_) {
		function processKey(key) {
			if (typeof root[key] === 'number' &&
			accessors[root[key]] !== undefined) {
				root[key] = accessors[root[key]];
			}
		}
		if (typeof key_ === 'string')
			processKey(key_);
		else
			for (var key in root) {
				processKey(key);
			}
	}

	loadAccessors(accessors) {
		var outer = this;
		this.primitives.forEach(function(primitive) {
			outer._loadAccessorsOn(primitive.attributes, accessors);
			outer._loadAccessorsOn(primitive, accessors, 'indices');
		});
	}

	_triangleStripsToVertexTriples(vertices) {
		if (vertices.length < 3) {
			return []; // weird case but just ignore it instead of throwing error.
		}

		// This is based on discussion at: 
		// https://stackoverflow.com/questions/23723993/converting-quadriladerals-in-an-obj-file-into-triangles
		var result = [];
		result.push(...vertices.slice(0, 3));
		for (var i = 3; i < vertices.length; i++) {
			result.push(
				vertices[i - 3],
				vertices[i - 1],
				vertices[i]
			);
		}
		return result;
	}

	_loadUsingIndices(indices, vertices) {
		console.log('indices = ', indices);
		var result = indices.map(function(index) {
			if (typeof vertices[index] !== 'object') {
				throw new Error('Unable to get vertex at index ' + index + '.  Must be in range 0..' + (vertices.length - 1));
			}
			return vertices[index];
		});
		
		return result;
	}

	getTrianglePositions(binDataView) {
		let result = [];
		var outer = this;
		this.primitives.filter(function(primitive) {
			return typeof primitive.attributes === 'object' &&
				typeof primitive.attributes.POSITION === 'object'; 
		}).forEach(function(primitive) {
			let accessor = primitive.attributes.POSITION;
			if (accessor instanceof GLTFAccessor) {
				let vals = accessor.get(binDataView);
				if (!(vals instanceof Array))
					throw new Error('Failed to get Array from GLTFAccessor get method');
				if (primitive.indices) {
					vals = outer._loadUsingIndices(primitive.indices.get(binDataView), vals);
				}
				if (typeof primitive.mode === 'number') {
					// if mode is 4, leave it alone.
					console.log('mode ' + primitive.mode + ' found.');
				}
				//vals = outer._triangleStripsToVertexTriples(vals);
				GLTFUtils.addToArray(result, vals);
			}
		});
		if (!(result instanceof Array))
			throw new Error('GLTFMesh: Array expected but got ' + result);
		return result;
	}
}