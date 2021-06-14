/*

https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#transformations

Depends on math.js library.
*/
class GLTFNode {
	constructor(o) {
		this._loadFromNodeObject(o);
	}

	loadChildrenFrom(nodes) {
		if (!(nodes instanceof Array))
			throw new Error('Array expected but found: ' + nodes);
		if (this.children.length > 0 && typeof this.children[0] === 'object')
			throw new Error('children already loaded.');
		this.children = this.children.map(function(childIndex) {
			return nodes[childIndex];
		});
	}

	loadMesh(meshes) {
		if (typeof this.mesh !== 'object' && typeof this.mesh === 'number' 
		&& meshes[this.mesh] !== undefined)
			this.mesh = meshes[this.mesh];
	}

	_loadFromNodeObject(o) {
		if (typeof o !== 'object')
			throw new Error('object is required.');
		this.name = o.name;
		this.mesh = o.mesh;
		this.children = o.children instanceof Array ? o.children : [];
		this._transformer = new GLTFTransformer();
		if (o.matrix !== undefined && o.matrix.length === 16)
			this._transformer.setTransformationMatrix(o.matrix);
		else {
			this._transformer.setTranslationRotationAndScale(o.translation, o.rotation, o.scale);
		}
	}

	transform(point) {
		return this._transformer.transform(point);
	}

	getPositionVectors(binDataView) {
		var outer = this;
		var result = [];
		if (this.mesh)
			result = this.mesh.getPositionVectors(binDataView);
		for (var i = 0; i < this.children.length; i++) {
			GLTFUtils.addToArray(result, this.children[i].getPositionVectors(binDataView));
		}
		result = result.map(function(point) {
			return outer.transform(point);
		});
		
		return result;
	}
}