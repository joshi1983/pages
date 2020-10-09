/*
Author: Josh Greig
Date: October 7, 2020
*/
document.addEventListener('DOMContentLoaded', function() {
	var points = [];
	var canvas = document.querySelector('canvas');
	var viewpointZ = 250;
	var xzRotation = 0;
	var xRotation = 0;
	var transformationMatrix;
	var g = canvas.getContext('2d');
	var t = new Date().getTime();
	var recentUpdateTimes = [];
	var oldClientX, oldClientY;
	var useSelectiveFocus = true;
	// turned on when a frame rate better than 15fps can be maintained.

	function getRGBComponent(s) {
		if (s.length === 1) {
			return parseInt(s + s, 16);
		}
		else {
			return parseInt(s, 16);
		}
	}

	function getRGBComponents(colour)
	{
		colour = colour.toLowerCase();
		if (colour.charAt(0) !== '#')
			throw new Error('Unable to get RGB components from: ' + colour);
		if (colour.length === 4) {
			return [
				getRGBComponent(colour.charAt(1)), 
				getRGBComponent(colour.charAt(2)),
				getRGBComponent(colour.charAt(3))
			];
		}
		else if (colour.length === 7) {
		}
	}

	function getFillStyle(colour, x, y, size, z)
	{
		if (!useSelectiveFocus) {
			return [colour, size];
		}
		var minZ = 90;
		var blurRatio = 1 - Math.max(0, Math.min(1, (z + minZ) * 0.15 / size));
		if (blurRatio > 0.95) // too clear to be worth the extra gradient work.
			return [colour, size];
		if (z > 20) // not shown anyway so don't waste processing time on them.
			return undefined;
		size *= (2 - blurRatio);
		var c = getRGBComponents(colour);
		var grad = g.createRadialGradient(x, y, size * blurRatio, x, y, size);
		grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},1)`);
		grad.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
		return [grad, size];
	}
	
	function getSpherePoints(radius, numPoints){
		var N = (numPoints - 1) / 2;
		var result = [];

		for (var i = -N; i <= N; i++)
		{
			var lat = Math.asin((2 * i) / (2 * N + 1));
			var lon = mod(i, 1.618034) * 3.883222;
			var r = radius * Math.cos(lat);
			result.push([
				r * Math.cos(lon),
				radius * Math.sin(lat),
				r * Math.sin(lon)
			]);
		}
		return result;
	}
	
	function mod(a, b)
	{
		return a - Math.floor(a / b) * b;
	}
	
	function getPoints() {
		var result = getSpherePoints(100, 1400);
		result.forEach(function(point) {
			point.size = 4;
			point.colour = '#888';
		});
		var colourfulPoints = getSpherePoints(103, 60);
		colourfulPoints.forEach(function(point) {
			point.colour = '#f80';
			point.size = 2.5;
			result.push(point);
		});
		var numRed = 40;
		var redPoints = getSpherePoints(115, numRed);
		redPoints.forEach(function(point) {
			point.colour = '#900';
			point.size = 10;
			result.push(point);
		});
		redPoints = getSpherePoints(105, numRed);
		redPoints.forEach(function(point) {
			point.colour = '#900';
			point.size = 4;
			result.push(point);
		});
		redPoints = getSpherePoints(103, numRed);
		redPoints.forEach(function(point) {
			point.colour = '#900';
			point.size = 3;
			result.push(point);
		});
		return result;
	}
	
	function transform(p) {
		var result = math.multiply([p], transformationMatrix)._data[0];
		result.original = p;
		return result;
	}

	function getPointPositionAndDepth(p, scale, translation) {
		var dz = viewpointZ + p[2];
		var result = [
			p[0] * scale / dz + translation.x, 
			p[1] * scale / dz + translation.y, 
			p.original.size * scale / dz
		];
		return result;
	}
	
	function compareByElement2(p1, p2) {
		return p2[2] - p1[2];
	}
	
	function processTime() {
		var newT = new Date().getTime();
		recentUpdateTimes = recentUpdateTimes.filter(function(t) {
			return newT - t < 1000;
		});
		if (recentUpdateTimes.length > 0 
		&& Math.floor(recentUpdateTimes[recentUpdateTimes.length - 1] / 3000) !== Math.floor(newT / 3000)) {
			if (recentUpdateTimes.length > 25 && !useSelectiveFocus) {
				useSelectiveFocus = true;
			}
			if (recentUpdateTimes.length < 10) {
				useSelectiveFocus = false;
			}
		}
		recentUpdateTimes.push(newT);
	}

	function updateDisplay() {
		updateTransformationMatrix();
		resized();
		processTime();
		var w = canvas.getAttribute('width'), h = canvas.getAttribute('height');
		var translation = {
			'x': w * 0.5,
			'y': h * 0.5
		};
		var scale = Math.min(translation.x, translation.y) * 1.4;
		g.clearRect(0, 0, w, h);
		var midDrawn = false;
		var transformedPoints = points.map(transform);
		transformedPoints.sort(compareByElement2);
		for (var i = 0; i < transformedPoints.length; i++) {
			if (!midDrawn && transformedPoints[i][2] < 0) {
				[0.2, 0.5, 0.9].forEach(function(opacity) {
					g.fillStyle = 'rgba(50, 50, 50, ' + opacity + ')';
					g.beginPath();
					var r = Math.max(1, scale * 0.45 - (opacity - 0.1) * 30);
					g.arc(translation.x, translation.y, r, 0, 2 * Math.PI);
					g.closePath();
					g.fill();
				});
				midDrawn = true;
			}
			var pointInfo = getPointPositionAndDepth(transformedPoints[i], scale, translation);
			var fillStyle = getFillStyle(transformedPoints[i].original.colour, pointInfo[0], pointInfo[1], pointInfo[2], transformedPoints[i][2]);
			if (fillStyle !== undefined) {
				g.fillStyle = fillStyle[0];
				g.beginPath();
				g.moveTo(pointInfo[0], pointInfo[1]);
				g.arc(pointInfo[0], pointInfo[1], fillStyle[1], 0, 2 * Math.PI);
				g.closePath();
				g.fill();
			}
		}
		requestAnimationFrame(updateDisplay);
	}
	
	function resized() {
		canvas.setAttribute('width', canvas.clientWidth);
		canvas.setAttribute('height', canvas.clientHeight);
	}
	
	function getTransformationMatrix() {
		var d = new Date().getTime();
		xzRotation += (d - t) * 0.0002;
		t = d;
		var cosTheta = Math.cos(xzRotation);
		var sinTheta = Math.sin(xzRotation);
		var result = math.matrix([
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		]);
		var xzRotationMatrix = math.matrix([
			[cosTheta, 0, sinTheta],
			[0, 1, 0],
			[-sinTheta, 0, cosTheta]
		]);
		cosTheta = Math.cos(xRotation);
		sinTheta = Math.sin(xRotation);
		var xRotationMatrix = math.matrix([
			[1, 0, 0],
			[0, cosTheta, -sinTheta],
			[0, sinTheta, cosTheta],
		]);
		result = math.multiply(result, xzRotationMatrix);
		result = math.multiply(result, xRotationMatrix);
		return result;
	}
	
	function sanitizeRotationAngles() {
		if (Math.abs(xRotation) > Math.PI) {
		    if (xRotation > 0)
		        xRotation -= Math.PI;
		    else
		        xRotation += Math.PI;
		}
	}
	
	function updateRotationAngles(newX, newY) {
	    if (typeof newX === 'number' && typeof newY === 'number') {
    		if (oldClientX !== undefined) {
    			xzRotation += (newX - oldClientX) * 0.002;
    			xRotation -= (newY - oldClientY) * 0.002;
        		sanitizeRotationAngles();
    		}
    		oldClientX = newX;
    		oldClientY = newY;
	    }
	}
	
	function mouseMoved(event) {
	    updateRotationAngles(event.clientX, event.clientY);
	}
	
	function touchMoved(event) {
	    updateRotationAngles(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
	}
	
	function updateTransformationMatrix() {
		transformationMatrix = getTransformationMatrix();
	}
	
	function clearClientCoordinates() {
	    oldClientX = undefined;
	    oldClientY = undefined;
	}

	resized();
	updateTransformationMatrix();
	points = getPoints();
	updateDisplay();
	canvas.addEventListener('mousemove', mouseMoved);
	canvas.addEventListener('touchend', clearClientCoordinates);
	canvas.addEventListener('mouseout', clearClientCoordinates);
	canvas.addEventListener('touchmove', touchMoved);
});