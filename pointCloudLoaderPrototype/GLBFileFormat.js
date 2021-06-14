/*
GLTFFileFormat loader is for a file format described at:
https://docs.fileformat.com/3d/gltf/
and
https://docs.fileformat.com/3d/glb/

This goes into much more detail:
https://github.com/KhronosGroup/glTF/tree/master/specification/2.0

A file using this format is downloadable from https://mars.nasa.gov/resources/25043/mars-ingenuity-helicopter-3d-model/
*/
class GLBFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.glb';
	}

	_loadBinary(arrayBuffer, defaultRGB) {
		var root = new GLTFRoot(arrayBuffer);
		var positions = root.getPositionVectors();

		return positions.map(function(position) {
			return new Point(position, defaultRGB.r, defaultRGB.g, defaultRGB.b);
		});
	}

	loadFromFile(file, defaultRGB) {
		if (typeof defaultRGB !== 'object')
			defaultRGB = {'r': 0, 'g': 0, 'b': 0};
		var reader = new FileReader();
		reader.readAsArrayBuffer(file);
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var arrayBuffer = evt.target.result;
				resolver(outer._loadBinary(arrayBuffer, defaultRGB));
			};
		});
	}
}