import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';
import { GLTFRoot } from './GLTF/GLTFRoot.js';

class GLBFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.glb';
	}

	_loadBinary(arrayBuffer) {
		var root = new GLTFRoot(arrayBuffer);
		var triangles = root.getTrianglePositions();
		var result = [];
		for (var i = 0; i < triangles.length - 2; i+=3) {
			var vertices = [];
			for (var j = 0; j < 3; j++) {
				vertices.push(new Vertex(triangles[i + j], [1,1,1]));
			}
			result.push(new Triangle(vertices));
		}
		
		return result;
	}

	loadFromFile(file) {
		var reader = new FileReader();
		reader.readAsArrayBuffer(file);
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var arrayBuffer = evt.target.result;
				resolver(outer._loadBinary(arrayBuffer));
			};
		});
	}
}

export { GLBFileFormatImporter };