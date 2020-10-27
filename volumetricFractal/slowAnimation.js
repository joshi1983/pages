function getAbcFromPoints(points) {
	// implementation taken from: 
	// http://smackaay.com/2009/04/29/3-point-quadratic-regression-formula/
	var denominator = (points[0].x - points[1].x) *
		(points[0].x - points[2].x) *
		(points[1].x - points[2].x);

	var aTop = points[2].x * (-points[0].y + points[1].y) +
		points[1].x * (points[0].y - points[2].y) +
		points[0].x * (-points[1].y + points[2].y);

	var bTop = points[2].x * points[2].x * 
		(points[0].y - points[1].y) +
		points[0].x * points[0].x * (points[1].y - points[2].y) +
		points[1].x * points[1].x * (-points[0].y + points[2].y);
	
	var cTop = points[2].x *
		(points[1].x * (points[1].x - points[2].x) * points[0].y + 
			points[0].x * (-points[0].x + points[2].x) * points[1].y
		) + 
		points[0].x * (points[0].x - points[1].x) * points[1].x * points[2].y;
	
	var a = aTop / denominator;
	var b = bTop / denominator;
	var c = cTop / denominator;
	return [a, b, c];
}

function getSplineCurveValue(points, x) {
	var slope = 0;
	var delta = 0.1;
	for (var i = 1; i < points.length; i++) {
		var p = points[i];
		var prevP = points[i - 1];
		var abc;
		if (prevP.ignorePreviousSlope) {
			// calculate slope.
			var m = (p.y - prevP.y) / (p.x - prevP.x);
			var yWhenXIsZero = p.y - m * p.x;
			abc = [0, m, yWhenXIsZero];
		}
		else {
			var slopePoint = {
				'x': prevP.x + delta,
				'y': prevP.y + delta * slope
			};
			abc = getAbcFromPoints([prevP, slopePoint, p]);
		}
		if (p.x > x) {
			// return result.
			return abc[0] * x * x + abc[1] * x + abc[2];
		}
		slope = 2 * abc[0] * p.x + abc[1];
	}
	// use a straight line after.
	return slope * (x - points[points.length - 1].x) + points[points.length - 1].y;
}

function getCurveValue(points, x) {
	if (points.length === 1) {
		return points[0].y;
	}
	else if (points.length === 2) {
		// solve straight line.
		var dx = points[1].x - points[0].x;
		// avoid division by zero.
		if (dx === 0)
			return points[0].y;
		var dy = points[1].y - points[0].y;
		var s = (x - points[1].x) / dx;
		return s * dy + points[1].y;
	}
	else if (points.length === 3) {
		var abc = getAbcFromPoints(points);
		return abc[0] * x * x + abc[1] * x + abc[2];
	}
	else {
		return getSplineCurveValue(points, x);
	}
}

class Animation {
	getDefaultProperties(deltaT) {
		var result = {
			'uiSettings': {
				'sphereRadius': getCurveValue([
					{'x': 0, 'y': 2, 'ignorePreviousSlope': true},
					{'x': 30000, 'y': 2},
					{'x': 60000, 'y': 3},
					{'x': 70000, 'y': 15},
					{'x': 80000, 'y': 7.9},
					{'x': 81000, 'y': 6},
					{'x': 85000, 'y': 6}
					], deltaT),
				'cReal': getCurveValue([
					{'x': 0, 'y': -1.63, 'ignorePreviousSlope': true},
					{'x': 10000, 'y': 0},
					{'x': 14000, 'y': 0.34},
					{'x': 15000, 'y': 0.34},
					{'x': 25000, 'y': 0.35},
					{'x': 38000, 'y': 0.35},
					{'x': 40000, 'y': 0.32},
					{'x': 55000, 'y': 0.2}
					], deltaT),
				'rotationAngle': getCurveValue([
					{'x': 0, 'y': 0},
					{'x': 5000, 'y': 0.2},
					{'x': 15000, 'y': 1.3},
					{'x': 20000, 'y': 2.5},
					{'x': 29000, 'y': 6},
					{'x': 33000, 'y': 7.6},
					{'x': 35400, 'y': 2.55 * Math.PI},
					{'x': 38000, 'y': 2.52 * Math.PI},
					{'x': 45000, 'y': 2.35 * Math.PI},
					{'x': 52800, 'y': 1.27 * Math.PI},
					{'x': 55000, 'y': 0.99 * Math.PI},
					{'x': 65000, 'y': 0.9280643189806786 * Math.PI},
					{'x': 69048, 'y': 0.9280643189806786 * Math.PI},
					{'x': 69049, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 85000, 'y': 0}
				], deltaT),
				'rotationRadius': getCurveValue([
					{'x': 0, 'y': 5, 'ignorePreviousSlope': true},
					{'x': 12000, 'y': 2},
					{'x': 13200, 'y': 1.85},
					{'x': 15500, 'y': 1.84},
					{'x': 29000, 'y': 1.282},
					{'x': 32000, 'y': 1.13},
					{'x': 35000, 'y': 0.8},
					{'x': 38000, 'y': 0.3},
					{'x': 40000, 'y': 0.1},
					{'x': 43000, 'y': 0},
					{'x': 55000, 'y': 0},
					{'x': 65000, 'y': -2.5},
					{'x': 69000.9, 'y': -5, 'ignorePreviousSlope': true},
					{'x': 69001, 'y': 8, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 8},
					{'x': 85000, 'y': 8},
					], deltaT),
				'planeCutValue': getCurveValue([
					{'x': 0, 'y': -6, 'ignorePreviousSlope': true},
					{'x': 69049, 'y': -6, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': -6},
					{'x': 85000, 'y': 6},
					], deltaT),
				'positionY': getCurveValue([
					{'x': 0, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 29000, 'y': 0},
					{'x': 31000, 'y': 0.011},
					{'x': 34000, 'y': 0.11},
					{'x': 36500, 'y': 0.4},
					{'x': 38000, 'y': 0.75},
					{'x': 40000, 'y': 1.085},
					{'x': 41400, 'y': 1.12},
					{'x': 55000, 'y': 1.13},
					{'x': 58500, 'y': 1.182},
					{'x': 65000, 'y': 1.5},
					{'x': 69000, 'y': 2.2},
					{'x': 69000, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 75000, 'y': 0}
					], deltaT),
				'peakOpacity': getCurveValue([
					{'x': 0, 'y': 0.1, 'ignorePreviousSlope': true},
					{'x': 10000, 'y': 1.6},
					{'x': 15000, 'y': 2},
					{'x': 29000, 'y': 2},
					{'x': 33000, 'y': 1.85},
					{'x': 35000, 'y': 1.6},
					{'x': 36500, 'y': 1.6},
					{'x': 38000, 'y': 1.8},
					{'x': 42000, 'y': 2},
					{'x': 55000, 'y': 2},
					{'x': 65000, 'y': 10.0, 'ignorePreviousSlope': true},
					{'x': 75000, 'y': 10.0},
					], deltaT),
				'ambient': getCurveValue([
					{'x': 0, 'y': 0.05},
					{'x': 45000, 'y': 0.05},
					{'x': 50000, 'y': 0.3},
					{'x': 55000, 'y': 1.0, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 1.0},
				], deltaT),
				'scaleFactor': getCurveValue([
					{'x': 0, 'y': 1},
					{'x': 45000, 'y': 0.7},
					{'x': 50000, 'y': 0.7},
					{'x': 69049, 'y': 1, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 1},
					{'x': 85000, 'y': 1},
				], deltaT),
				'isShowingPlaneCut': false,
				'lineThicknessFactor': 0.0005
			}
		};
		if (deltaT < 81050)
			result.uiSettings.planeCutAxis = 3;
		else if (deltaT < 93050)
			result.uiSettings.planeCutAxis = 2;
		else {
			result.uiSettings.planeCutAxis = 1;
		}
		return result;
	}

	getIntroProperties(deltaT) {
		return {
			'uiSettings': {
				'sphereRadius': 3,
				'maxIterations': 50
			}
		};
	}
	
	getHotBrightColourProperties(deltaT) {
		deltaT -= 15000;
		return {
			'uiSettings': {
				'sphereRadius': 2
			}
		};
	}
	
	startRiseUp(deltaT) {
		deltaT -= 29000;
		return {
			'uiSettings': {
			}
		};
	}

	finishRiseUp(deltaT) {
		deltaT -= 35000;
		return {
			'uiSettings': {
			}
		};
	}
	
	startPeakView(deltaT) {
		deltaT -= 38000;
		return {
			'uiSettings': {
			}
		};
	}

	peakRotation(deltaT) {
		deltaT -= 45000;
		return {
			'uiSettings': {
			}
		};
	}
	
	toTheEdge(deltaT) {
		deltaT -= 55000;
		return {
			'uiSettings': {
			}
		};
	}
	
	cutFromTheEdge(deltaT) {
		deltaT -= 69050;
		return {
			'uiSettings': {
				'isShowingPlaneCut': true
			}
		};
	}
	
	_deepCopy(o1, o2) {
		for (var key in o2) {
			if (o1[key] === undefined)
				o1[key] = o2[key];
			else if (typeof o2[key] === 'object') {
				this._deepCopy(o1[key], o2[key]);
			}
			else {
				o1[key] = o2[key];
			}
		}
	}
	
	getPropertiesForTime(deltaT) {
		var result = this.getDefaultProperties(deltaT);
		if (deltaT < 15 * 1000) {
			this._deepCopy(result, this.getIntroProperties(deltaT));
		}
		else if (deltaT < 29 * 1000) {
			this._deepCopy(result, this.getHotBrightColourProperties(deltaT));
		}
		else if (deltaT < 35 * 1000) {
			this._deepCopy(result, this.startRiseUp(deltaT));
		}
		else if (deltaT < 38 * 1000) {
			this._deepCopy(result, this.finishRiseUp(deltaT));
		}
		else if (deltaT < 45 * 1000) {
			this._deepCopy(result, this.startPeakView(deltaT));
		}
		else if (deltaT < 55 * 1000) {
			this._deepCopy(result, this.peakRotation(deltaT));
		}
		else if (deltaT < 69050) {
			this._deepCopy(result, this.toTheEdge(deltaT));
		}
		else if (deltaT < 85 * 1000) {
			this._deepCopy(result, this.cutFromTheEdge(deltaT));
		}
		return result;
	}

	getMusicURL() {
		return 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3';
	}

	getMaxTime() {
		return 85 * 1000;
	}
}