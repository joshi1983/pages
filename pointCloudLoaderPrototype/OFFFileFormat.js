/*
Object File Format is described at:
https://en.wikipedia.org/wiki/OFF_(file_format)

It is supported by MeshLab.
*/
class OFFFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.off';
	}

	_cleanLinesOfContent(content) {
		var lines = content.split("\n").slice(1); 
		// remove the first line containing "OFF".
		return lines.map(function(line) {
			// remove comments wherever they may appear in the line.
			var index = line.indexOf('#');
			if (index !== -1)
				line = line.substring(0, index);
			
			line = line.replace(/\s+/g, ' ');
			return line.trim();
		}).filter(function(line) {
			var parts = line.split(' ');
			return parts.length > 2;
		});
	}

	_loadFromVertices(content, defaultRGB) {
		var lines = this._cleanLinesOfContent(content);
		var metaLine = lines[0];
		var parts = metaLine.split(' ');
		var numPoints = parseInt(parts[0]);
		return lines.slice(1, numPoints + 1).map(function(line) {
			var parts = line.split(' ').map(function(s) {
				return parseFloat(s);
			}).filter(function(n) {
				return !isNaN(n); // filter out values that are not numbers.
			});
			var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
			// if colours are specified, use them.
			if (parts.length >= 6) {
				r = parts[3];
				g = parts[4];
				b = parts[5];
			}
			return new Point(parts.slice(0, 3), r, g, b);
		});
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
				resolver(outer._loadFromVertices(content, defaultRGB));
			};
		});
	}
}