/*
The .vef file format is described at:
http://paulbourke.net/dataformats/vef/
*/
class VEFFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.vef';
	}

	_loadAscii(content, defaultRGB) {
		var lines = content.split('\n').map(function(line) {
			var index = line.indexOf('#');
			if (index !== -1) // remove comment.
				line = line.substring(0, index);
			return line.trim().replace(/\s+/g, ' ');
		});
		var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
		var parts = lines[0].split(' ');
		if (parts.length !== 1)
			throw new Error('Invalid VEF file format.  1 integer expected on first line but found ' + parts.length);
		var numVertices = parseInt(parts[0]);
		var vertices = [];
		for (var i = 1; i <= numVertices; i++) {
			var line = lines[i];
			var parts = line.split(' ').map(function(s) {
				return parseFloat(s);
			});
			vertices.push(new Point(parts, r, g, b));
		}
		return vertices;
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