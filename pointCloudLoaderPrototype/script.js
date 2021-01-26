document.addEventListener("DOMContentLoaded", function() {
	var canvas = document.querySelector('canvas');
	var g = canvas.getContext('2d');
	var points = [];
	var filteredPointsCache;
	var maxRange = 0;
	var midX = 0;
	var midY = 0;
	var dotSize = 4;
	var fileSelector = document.getElementById('cloud-file');
	var format = new PointCloudFileFormats();
	var rotator = new PointRotator();
	var dialog;
	fileSelector.setAttribute('accept', format.accept);
	fileSelector.addEventListener('input', function() {
		hideDialog();
		var file = fileSelector.files[0];
		if (file) {
			var filename = file.name;
			format.loadFromFile(file).then(function(result) {
				points = result;
				pointsUpdated();
				draw();
			});
		}
	});

	function getMaxRange(coordIndex) {
		var min = Number.MAX_VALUE;
		var max = - Number.MAX_VALUE;
		points.forEach(function(point) {
			min = Math.min(min, point.coords[coordIndex]);
			max = Math.max(max, point.coords[coordIndex]);
		});
		var mid = (max + min) * 0.5;
		points.forEach(function(point) {
			point.coords[coordIndex] -= mid;
		});
		return {
			'len': max - min
		};
	}

	function to2DigitHex(ratio) {
		// clamp to range 0 to 255.
		ratio = Math.max(0, Math.min(255, Math.round(ratio * 255)));
		var result = '' + ratio.toString(16);
		while (result.length < 2)
			result = '0' + result;
		return result;
	}

	function pointsUpdated() {
		var xRange = getMaxRange(0);
		var yRange = getMaxRange(1);
		var zRange = getMaxRange(2);
		maxRange = Math.max(xRange.len, yRange.len, zRange.len);
		points.forEach(function(point) {
			point.htmlColour = '#' + to2DigitHex(point.r) + to2DigitHex(point.g) + to2DigitHex(point.b);
		});
		filteredPointsCache = undefined; // indicate the cache needs to be refreshed.
	}

	function comparePointZ(p1, p2) {
		return p2.rotatedCoords[2] - p1.rotatedCoords[2];
	}

	function getPointsToDraw() {
		// skip enough points to draw only a certain number of points.
		// this is to avoid choppiness and responsiveness problems 
		// when drawing the display.
		var roughLimitToDraw = 5000;
		var modulo = 1;
		if (points.length > roughLimitToDraw) {
			modulo = Math.floor(points.length / roughLimitToDraw);
		}
		if (filteredPointsCache === undefined)
			filteredPointsCache = points.filter(function(point, index) {
				return index % modulo === 0;
			});
		filteredPointsCache.forEach(function(p) {
			var coords = rotator.transform(p.coords);
			p.rotatedCoords = coords;
		});
		// sort by rotatedCoords[2]
		filteredPointsCache.sort(comparePointZ);

		return filteredPointsCache;
	}

	function draw() {
		var w = window.innerWidth;
		var h = canvas.clientHeight;
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		g.clearRect(0, 0, w, h);
		var scale = 0.5 * ( (w + h) * 0.5) / maxRange;
		var xTranslation = w/2;
		var yTranslation = h/2;
		var pointsToDraw = getPointsToDraw();
		pointsToDraw.forEach(function(p, index) {
			var x = p.rotatedCoords[0] * scale + xTranslation;
			var y = p.rotatedCoords[1] * scale + yTranslation;
			g.fillStyle = p.htmlColour;
			g.beginPath();
			g.arc(x, y, dotSize, 0, 2 * Math.PI);
			g.closePath();
			g.fill();
		});
	}
	
	function resized() {
		var smartSize = (window.innerWidth + window.innerHeight) * 0.003;

		// smaller dot sizes look better if there are lots of points.
		if (points.length > 500)
			smartSize *= 0.7;

		dotSize = Math.min(10, Math.max(1.5, smartSize)); // confine to range 1.5 to 10.
		draw();
	}

	function updateRotation() {
		var t = (new Date().getTime()) * 0.0002;
		t = t % (Math.PI * 2);
		rotator.setAngle(t);
		draw();
		requestAnimationFrame(updateRotation);
	}

	function hideDialog() {
		dialog.remove();
	}

	function initDialog() {
		dialog = document.getElementById('dialog');
		function okClicked() {
			hideDialog();
			fileSelector.click();
		}
		document.getElementById('dialog-ok').addEventListener('click', okClicked);
	}

	window.addEventListener('resize', resized);
	updateRotation();
	initDialog();
	resized();
});