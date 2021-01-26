class WRLFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.wrl';
	}

	_loadAscii(content, defaultRGB) {
		var scene = WRLUtils.vrmlToX3DDocument(content);
		var x3dFormat = new X3DFileFormat();
		var points = x3dFormat.getPointsFromScene(scene, defaultRGB);
		return points;
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
				resolver(outer._loadAscii(content, defaultRGB));
			};
		});
	}
}