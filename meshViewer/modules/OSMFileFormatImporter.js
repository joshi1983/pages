import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';

class OSMFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.osm';
	}

	_loadFromString(s) {
		
		return triangles;
	}

	loadFromFile(file) {
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var content = evt.target.result;
				resolver(outer._loadFromString(content));
			};
		});
	}
}

export { OSMFileFormatImporter };