/*
The .tri file format is described at:
http://paulbourke.net/dataformats/tri/
*/
class TRIFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.tri';
	}

	_loadAscii(content, defaultRGB) {
		var lines = content.split('\n').map(function(line) {
			return line.trim().replace(/\s+/g, ' ');
		});
		var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
		var parts = lines[0].split(' ');
		if (parts.length !== 2)
			throw new Error('Invalid TRI file format.  2 integers expected on first line but found ' + parts.length);
		var numVertices = parseInt(parts[0]);
		var result = [];
		for (var i = 1; i <= numVertices; i++) {
			var line = lines[i];
			var parts = line.split(' ').map(function(s) {
				return parseFloat(s);
			});
			var v = new Point(parts.slice(0, 3), r, g, b);
			if (parts.length > 3) // this should always be the case.
			{
				v.r = parts[6];
				v.g = parts[7];
				v.b = parts[8];
			}
			result.push(v);
		}
		return result;
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