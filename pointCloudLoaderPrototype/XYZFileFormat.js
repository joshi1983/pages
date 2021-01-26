/*
The .xyz file format isn't very clearly defined.

I researched it from articles like:
https://stackoverflow.com/questions/41267210/point-cloud-xyz-format-specification
and:
https://en.wikipedia.org/wiki/XYZ_file_format
*/
class XYZFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.xyz';
	}

	loadFromString(s, defaultRGB) {
		var lines = s.split("\n");

		lines = XYZFileFormat.filterComments(lines);

		function isNumber(s) {
			s = parseFloat(s);
			return !isNaN(s);
		}

		function convertToNumber(s) {
			return parseFloat(s);
		}
		
		var data = [];
		var lengthFrequencies = {};

		lines.forEach(function(line) {
			var parts = line.split(/[\s,]+/);
			parts = parts.filter(isNumber).map(convertToNumber);
			if (parts.length >= 3) {
				data.push(parts);
				var key = '' + parts.length;
				if (lengthFrequencies[key] === undefined)
					lengthFrequencies[key] = 0;
				lengthFrequencies[key]++;
			}
		});

		// How many numbers are the most common per line?
		// Usually this is 3 but maybe there are some numbers for r, g, b.
		var dominantLength;
		for (var key in lengthFrequencies) {
			if (dominantLength === undefined || lengthFrequencies[dominantLength] < lengthFrequencies[key])
				dominantLength = key;
		}
		dominantLength = parseInt(dominantLength);

		var result = data.filter(function(parts) {
			return parts.length === dominantLength;
		}).map(function(parts) {
			var newPoint;
			if (parts.length < 6) {
				newPoint = new Point(parts, defaultRGB.r, defaultRGB.g, defaultRGB.b);
			}
			else if (parts.length >= 6) {
				newPoint = new Point(parts.slice(0, 3), parts[3], parts[4], parts[5]);
			}
			return newPoint;
		});

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
				resolver(outer.loadFromString(content, defaultRGB));
			};
		});
	}
}

// The first few lines of the file might be comments.
// This is based on a comment from:
// https://people.math.sc.edu/Burkardt/data/xyz/xyz.html
XYZFileFormat.filterComments = function(lines) {
	return lines.filter(function(line) {
		return line.trim().charAt(0) !== '#';
	});
}
