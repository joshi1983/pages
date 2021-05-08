document.addEventListener('DOMContentLoaded', function() {
	var minInput = document.getElementById('rangeMin');
	var maxInput = document.getElementById('rangeMax');
	var propertyName = document.getElementById('propertyName');
	var canvas = document.querySelector('canvas');
	var g = canvas.getContext('2d');
	var key;
	var animation = new Animation();
	var minT, maxT;

	maxInput.value = animation.getMaxTime();
	updatePropertyNameSelectOptions();
	
	function getPropertyNameOptions() {
		var resultSet = new Set();
		for (var i = 0; i < animation.getMaxTime(); i++) {
			var properties = animation.getPropertiesForTime(i);
			for (var key in properties.uiSettings) {
				resultSet.add(key);
			}
		}
		
		return Array.from(resultSet);
	}
	
	function updatePropertyNameSelectOptions() {
		getPropertyNameOptions().forEach(function(key) {
			var option = document.createElement('option');
			option.setAttribute('value', key);
			option.innerText = key;
			propertyName.appendChild(option);
		});
	}
	
	function resetGraphRanges() {
		minT = parseFloat(minInput.value);
		maxT = parseFloat(maxInput.value);
		
		// sanitize by swapping if min is actually larger than max.
		if (minT > maxT) {
			var t = minT;
			minT = maxT;
			maxT = t;
		}
		updateGraph();
	}
	
	function propertyNameChanged() {
		key = propertyName.value.trim().replace(/\s/g, '');
		updateGraph();
	}
	
	function getProperty(props, key) {
		if (typeof props.uiSettings === 'object') {
			return props.uiSettings[key];
		}
	}
	
	function getPoints() {
		var results = [];
		var delta = (maxT - minT) / 500.0;
		var y;
		for (var i = minT; i <= maxT; i+=delta) {
			var properties = animation.getPropertiesForTime(i);
			var val = getProperty(properties, key);
			if (typeof val === 'boolean') {
				val = val ? 1 : 0;
			}
			if (typeof val === 'number' && !isNaN(val)) {
				y = val;
			}
			if (typeof y === 'number' && !isNaN(y)) {
				results.push({'x': i, 'y': y});
			}
		}
		return results;
	}
	
	function getY(p) {
		return p.y;
	}
	
	function isNotWeird(p) {
		return p.y !== Infinity;
	}
	
	function transform(p, minY, maxY, w, h) {
		var padding = 15;
		var marginLeft = 20;
		var marginTop = 20;
		return {
			'x': padding + marginLeft + (p.x - minT) * (w - padding * 2 - marginLeft) / (maxT - minT),
			'y': padding + marginTop + (p.y - minY) * (h - padding * 2 - marginTop) / (maxY - minY)
		};
	}
	
	function drawGridLines(minY, maxY, w, h, colour) {
		var dy = Math.abs(maxY - minY);
		if (dy === 0 || dy === Infinity)
			return;
		var log = Math.round(Math.log10(dy));
		var interval = Math.pow(10, log - 1);
		var start = Math.round(minY / interval) * interval;
		g.strokeStyle = '#ddd';
		g.beginPath();
		for (var i = start; i < maxY; i += interval) {
			var transformedP = transform({
				'x': 0, 'y': i
			}, minY, maxY, w, h);
			g.moveTo(0, transformedP.y);
			g.lineTo(w, transformedP.y);
		}
		g.closePath();
		g.stroke();
	
		g.strokeStyle = '#eee';
		g.beginPath();
		for (var i = 0; i < maxT; i += 2000) {
			var transformedP = transform({
				'x': i, 'y': 0
			}, minY, maxY, w, h);
			g.moveTo(transformedP.x, 0);
			g.lineTo(transformedP.x, h);
		}
		g.closePath();
		g.stroke();

		g.fillStyle = '#000';
		g.beginPath();
		for (var i = 5; i * 1000 < maxT; i += 5) {
			var transformedP = transform({
				'x': i * 1000, 'y': 0
			}, minY, maxY, w, h);
			g.fillText(('' + i).substring(0, 5), transformedP.x, 20);
		}

		for (var i = start; i < maxY; i += interval) {
			var transformedP = transform({
				'x': 0, 'y': i
			}, minY, maxY, w, h);
			g.fillText(('' + i).substring(0, 5), 5, transformedP.y);
		}
		g.closePath();
		g.fill();
	}
	
	function drawPoints(points, colour, clearCanvas) {
		var w = parseInt(canvas.getAttribute('width'));
		var h = parseInt(canvas.getAttribute('height'));
		if (clearCanvas) {
			g.clearRect(0, 0, w, h);
			g.fillStyle = '#fff';
			g.beginPath();
			g.rect(0, 0, w, h);
			g.closePath();
			g.fill();
		}
		var minY = Math.min(...points.filter(isNotWeird).map(getY)), maxY = Math.max(...points.filter(isNotWeird).map(getY));
		if (typeof minY === 'number' && typeof maxY === 'number') {
			var started = false;
			if (clearCanvas) {
				drawGridLines(minY, maxY, w, h, colour);
			}
			
			g.strokeStyle = colour;
			g.beginPath();
			points.forEach(function(p) {
				var transformedP = transform(p, minY, maxY, w, h);
				transformedP.x = Math.round(transformedP.x);
				if (!started) {
					g.moveTo(transformedP.x, transformedP.y);
					started = true;
				}
				else {
					g.lineTo(transformedP.x, transformedP.y);
				}
			});
			g.stroke();
			g.closePath();
			
			if (clearCanvas) {
				var extraPoints = [
					{'x': 0, 'y': 5, 'ignorePreviousSlope': true},
					{'x': 30000, 'y': 5},
					{'x': 69049.9, 'y': 5, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 4, 'ignorePreviousSlope': true},
					{'x': 81049.9, 'y': -4, 'ignorePreviousSlope': true},
					{'x': 81050, 'y': 4, 'ignorePreviousSlope': true},
					{'x': 92849.9, 'y': -4, 'ignorePreviousSlope': true},
					{'x': 92850, 'y': -1.5, 'ignorePreviousSlope': true},
					{'x': 93500, 'y': 0.2},
					{'x': 95300, 'y': 1.5, 'ignorePreviousSlope': true},
					{'x': 105000, 'y': 3},
];
				g.strokeStyle = '#f00';
				extraPoints.forEach(function(p) {
					var transformedP = transform(p, minY, maxY, w, h);
					g.beginPath();
					g.moveTo(transformedP.x + 5, transformedP.y);
					g.arc(transformedP.x, transformedP.y, 5, 0, Math.PI * 2);
					g.closePath();
					g.stroke();
				});
			}
		}
	}
	
	function updateGraph() {
		var points = getPoints();
		drawPoints(points, '#000', true);
		
		// get slope values.
		var slopePoints = [];
		for (var i = 1; i < points.length; i++) {
			slopePoints.push({
				'x': points[i].x,
				'y': (points[i].y - points[i - 1].y) / (points[i].x - points[i - 1].x)
			});
		}
		//drawPoints(slopePoints, '#00f');
	}
	
	function resized() {
		var w = window.innerWidth;
		var h = canvas.clientHeight;
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		updateGraph();
	}
	
	function mouseMoved(event) {
		
	}

	canvas.addEventListener('mousemove', mouseMoved);
	window.addEventListener('resize', resized);
	rangeMin.addEventListener('input', resetGraphRanges);
	rangeMax.addEventListener('input', resetGraphRanges);
	propertyName.addEventListener('input', propertyNameChanged);
	resized();
	resetGraphRanges();
	propertyNameChanged();
});