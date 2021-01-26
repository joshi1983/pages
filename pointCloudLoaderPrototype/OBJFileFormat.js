class OBJFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.obj';
	}

	_loadFromVertices(content, defaultRGB) {
		var lines = content.split("\n");
		return lines.map(function(line) {
			// remove comments wherever they may appear in the line.
			var index = line.indexOf('#');
			if (index !== -1)
				line = line.substring(0, index);
			
			line = line.replace(/\s+/g, ' ');
			return line.trim();
		}).filter(function(line) {
			// We only care about lines starting with "v ".
			return line.indexOf("v ") === 0;
		}).map(function(line) {
			var parts = line.substring(2).split(' ').map(function(s) {
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