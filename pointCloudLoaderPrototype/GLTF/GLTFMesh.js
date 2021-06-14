class GLTFMesh {
	constructor(o) {
		this.name = o.name;
		this.primitives = o.primitives;
	}

	_loadAccessorsOn(root, accessors) {
		for (var key in root) {
			if (typeof root[key] === 'number' &&
			accessors[root[key]] !== undefined) {
				root[key] = accessors[root[key]];
			}
		}
	}

	loadAccessors(accessors) {
		var outer = this;
		this.primitives.forEach(function(primitive) {
			outer._loadAccessorsOn(primitive.attributes, accessors);
		});
	}

	getPositionVectors(binDataView) {
		let result = [];
		this.primitives.filter(function(primitive) {
			return typeof primitive.attributes === 'object' &&
				typeof primitive.attributes.POSITION === 'object'; 
		}).forEach(function(primitive) {
			let accessor = primitive.attributes.POSITION;
			if (accessor instanceof GLTFAccessor) {
				let vals = accessor.get(binDataView);
				GLTFUtils.addToArray(result, vals);
			}
		});
		console.log('getPositionVectors on GLTFMesh returning: ', result);
		return result;
	}
}