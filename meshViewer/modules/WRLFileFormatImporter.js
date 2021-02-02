import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { X3DFileFormatImporter } from './X3DFileFormatImporter.js';

export class WRLFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.wrl';
	}

	_loadFromString(content) {
		var scene = WRLUtils.vrmlToX3DDocument(content);
		var x3dImporter = new X3DFileFormatImporter();
		return x3dImporter.getTrianglesFromScene(scene, {'r': 1, 'g': 1, 'b': 1});
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