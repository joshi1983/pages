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
