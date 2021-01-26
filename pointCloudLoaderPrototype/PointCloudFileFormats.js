class PointCloudFileFormats {
	constructor() {
		this.fileFormats = [new MOLFileFormat(), new OBJFileFormat(), 
			new OFFFileFormat(), new OSMFileFormat(), new PCDFileFormat(), new PLYFileFormat(),
			new STLFileFormat(), new TRIFileFormat(), new VEFFileFormat(),
			new WRLFileFormat(), new X3DFileFormat(), new XYZFileFormat()];
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