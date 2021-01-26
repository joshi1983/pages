class MOLFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.mol';
	}

	_loadAscii(content, defaultRGB) {
		var lines = content.split('\n').slice(3).map(function(line) {
			return line.trim().replace(/\s+/g, ' ');
		});
		var r = defaultRGB.r, g = defaultRGB.g, b = defaultRGB.b;
		var parts = lines[0].split(' ');
		var numAtoms = parseInt(parts[0]);
		var result = [];
		for (var i = 1; i <= numAtoms; i++) {
			var line = lines[i];
			var parts = line.split(' ');
			if (parts.length >= 3) {
				var coordinates = [];
				for (var coordinateIndex = 0; coordinateIndex < 3; coordinateIndex++) {
					var val = parseFloat(parts[coordinateIndex]);
					if (isNaN(val)) {
						console.error('Invalid .mol format. Number expected but ' + parts[coordinateIndex] + ' found.  Line: ' + line);
						break;
					}
					else
						coordinates.push(val);
				}
				if (coordinates.length === 3) {
					result.push(new Point(coordinates, r, g, b));
				}
			}
			else {
				console.error('Invalid .mol format. Line expected to have at least 3 numbers but only ' + parts.length + ' found.');
			}
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