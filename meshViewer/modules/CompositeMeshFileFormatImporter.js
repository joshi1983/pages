import { GLBFileFormatImporter } from './GLBFileFormatImporter.js';
import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { OBJFileFormatImporter } from './OBJFileFormatImporter.js';
import { PLYFileFormatImporter } from './PLYFileFormatImporter.js';
import { STLFileFormatImporter } from './STLFileFormatImporter.js';
import { TRIFileFormatImporter } from './TRIFileFormatImporter.js';
import { WRLFileFormatImporter } from './WRLFileFormatImporter.js';
import { VEFFileFormatImporter } from './VEFFileFormatImporter.js';
import { X3DFileFormatImporter } from './X3DFileFormatImporter.js';

export class CompositeMeshFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.fileFormats = [new GLBFileFormatImporter(), 
			new OBJFileFormatImporter(),
			new PLYFileFormatImporter(), new STLFileFormatImporter(),
			new TRIFileFormatImporter(), new VEFFileFormatImporter(),
			new WRLFileFormatImporter(), new X3DFileFormatImporter()];
		var accept = '';
		this.fileFormats.forEach(function(format) {
			if (accept !== '')
				accept += ',';
			accept += format.accept;
		});
		this.accept = accept;
	}

	loadFromFile(file, defaultRGB) {
		// find the best file format to load the file from.
		var matchingFileFormats = this.fileFormats.filter(function(fileFormat) {
			return fileFormat.matches(file.name);
		});
		if (matchingFileFormats.length === 1)
			return matchingFileFormats[0].loadFromFile(file, defaultRGB);
	}	
}