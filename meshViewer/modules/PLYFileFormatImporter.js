import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { PLYHeader } from './PLY/PLYHeader.js';
import { PLYAsciiLoader } from './PLY/PLYAsciiLoader.js';
import { PLYBinaryLoader } from './PLY/PLYBinaryLoader.js';

export class PLYFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.ply';
	}

	loadFromFile(file, defaultRGB) {
		if (typeof defaultRGB !== 'object')
			defaultRGB = {'r': 0, 'g': 0, 'b': 0};
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var content = evt.target.result;
				var headerInfo = PLYHeader.getHeaderInfo(content);
				if (headerInfo.format === 'ascii')
					resolver(PLYAsciiLoader.load(headerInfo, content, defaultRGB));
				else {
					reader.readAsArrayBuffer(file);
					reader.onload = function(evt) {
						var data = evt.target.result;
						var len = headerInfo.headerEndOffset;
						data = data.slice(len, data.byteLength);
						if (headerInfo.format === 'binary_big_endian')
							resolver(PLYBinaryLoader.load(headerInfo, data, false, defaultRGB));
						else if (headerInfo.format === 'binary_little_endian')
							resolver(PLYBinaryLoader.load(headerInfo, data, true, defaultRGB));
						else
							throw new Error('Unsupported format: ' + headerInfo.format);
					}
				}
			};
		});
	}
}