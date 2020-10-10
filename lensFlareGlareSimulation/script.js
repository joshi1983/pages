class GlareEffect {
	
}var maxGlareRadius = 300;
var distantPeakRadius = 150;
var distantPeakThickness = 30;
var allWhiteThreshold = 1000;
var chromaticOverflowCoefficient = 0.9;
var lesserChromaticOverflowCoefficient = chromaticOverflowCoefficient * 0.6;
var maxRadialCoefficient = 0.2;

class HumanEyeGlareEffect extends GlareEffect {
	getChromaticOverflowValue(value) {
		if (value <= 0) {
			return 0;
		}
		let result = value - 255;
		return result;
	}
	
	chromaticOverflow(c) {
		if (c.red > allWhiteThreshold || c.green > allWhiteThreshold || c.blue > allWhiteThreshold) {
			return Colour.WHITE;
		}
		let result = {
			'red': c.red,
			'green': c.green,
			'blue': c.blue
		};
		if (result.red > 255) {
			result.green += this.getChromaticOverflowValue(c.red) * chromaticOverflowCoefficient;
			result.blue += this.getChromaticOverflowValue(c.red) * lesserChromaticOverflowCoefficient;
		}
		if (result.green > 255) {
			result.red += this.getChromaticOverflowValue(result.green) * chromaticOverflowCoefficient;
			result.blue += this.getChromaticOverflowValue(result.green) * chromaticOverflowCoefficient;
		}
		if (result.blue > 255) {
			result.green += this.getChromaticOverflowValue(result.blue) * chromaticOverflowCoefficient;
			result.red += this.getChromaticOverflowValue(result.blue) * lesserChromaticOverflowCoefficient;
		}
		return result;
	}
	
	processRadialLine(distance, maxResult) {
		let width = Math.max(1, maxResult * 20);
		if (distance > width) {
			return 0;
		}
		else {
			let coefficient = (width - distance) / width;
			if (distance <= 1) {
				coefficient *= 2;
			}
			return maxResult * coefficient;
		}
	}
	
	getColourAt(displacement, glareColour) {
		let m = Vector.getMagnitude(displacement);
		if (m > maxGlareRadius) {
			return Colour.BLACK;
		}
		let brightnessDependentMaxGlareRadius = maxGlareRadius;
		let maxValue = Math.max(glareColour.red, glareColour.green, glareColour.blue);
		let alphaRatio = Math.min(1, maxValue / 255.0);
		if (alphaRatio < 0.1 && m < 1.01) {
			return glareColour;
		}
		// if not very bright, shrink the max glare radius.
		if (maxValue < 1000) {
			brightnessDependentMaxGlareRadius *= maxValue / 1000;
			if (maxValue < 255 && maxValue > 1) {
				brightnessDependentMaxGlareRadius *= maxValue / 255;
			}
			brightnessDependentMaxGlareRadius = Math.max(1, brightnessDependentMaxGlareRadius);
		}
		if (m > brightnessDependentMaxGlareRadius) {
			return Colour.BLACK;
		}
		m = Math.max(1, m);
		let scalar = Math.max(0, alphaRatio / m - (1.0 / brightnessDependentMaxGlareRadius));
		let result = Colour.multiplyScalar(scalar, glareColour);
		if (m <= 1.01) {
			Colour.inPlaceAdd(result, glareColour);
		}
		if (result.red > allWhiteThreshold || result.green > allWhiteThreshold || result.blue > allWhiteThreshold) {
			return Colour.WHITE;
		}
		let distance2 = distantPeakThickness - Math.abs(m - distantPeakRadius);
		if (distance2 > 0) {
			Colour.inPlaceAdd(result, Colour.multiplyScalar(distance2 * 0.01 * alphaRatio / distantPeakRadius, glareColour));
		}
		
		// radial lines.
		let coefficient = 1;
		let distanceAffectedMaximumRadialCoefficient = maxRadialCoefficient * (brightnessDependentMaxGlareRadius - m) / brightnessDependentMaxGlareRadius;
		coefficient += alphaRatio * this.processRadialLine(Math.abs(displacement.x), distanceAffectedMaximumRadialCoefficient);
		coefficient += alphaRatio * this.processRadialLine(Math.abs(displacement.y), distanceAffectedMaximumRadialCoefficient);
		let diagonalCoefficient = distanceAffectedMaximumRadialCoefficient * 0.5;
		coefficient += alphaRatio * this.processRadialLine(Math.abs(displacement.x - displacement.y), diagonalCoefficient);
		coefficient += alphaRatio * this.processRadialLine(Math.abs(displacement.x + displacement.y), diagonalCoefficient);
		
		Colour.inPlaceMultiplyScalar(coefficient, result);
		
		return result;
	}
}class Colour {
	static clone(c) {
		return {
			'red': c.red,
			'green': c.green,
			'blue': c.blue
		};
	}
	
	static inPlaceMultiplyScalar(s, c1) {
		if (s === 0) {
			c1.red = 0;
			c1.green = 0;
			c1.blue = 0;
			return;
		}
		c1.red *= s;
		c1.green *= s;
		c1.blue *= s;
	}

	static multiplyScalar(s, c1) {
		if (s === 0) {
			return {
				'red': 0,
				'green': 0,
				'blue': 0
			};
		}
		return {
			'red': s * c1.red,
			'green': s * c1.green,
			'blue': s * c1.blue,
		};
	}
	
	static inPlaceAdd(c1, c2) {
		c1.red += c2.red;
		c1.green += c2.green;
		c1.blue += c2.blue;
	}

	static convertTo2DigitHex(value) {
		// Force into required range.
		value = Math.min(255, Math.max(0, value));
		// Convert to hex string.
		value = Math.floor(value).toString(16);
		if (value.length == 1) {
			return '0' + value;
		}
		else {
			return value;
		}
	}

	static convertToHTMLCode(c) {
		return '#' + Colour.convertTo2DigitHex(c.red) + Colour.convertTo2DigitHex(c.green) + Colour.convertTo2DigitHex(c.blue);
	}
}

Colour.BLACK = {
	'red': 0,
	'green': 0,
	'blue': 0
};

Colour.WHITE = {
	'red': 255,
	'green': 255,
	'blue': 255
};class Vector {
	static getMagnitude(v) {
		// check cache.
		if (v.magnitude !== undefined) {
			return v.magnitude;
		}

		let magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
		v.magnitude = magnitude; // cache in case it speeds things up later.
		return magnitude;
	}
}document.addEventListener('DOMContentLoaded', function() {
	let brightnessInput = document.getElementById('brightness-coefficient');
	let brightnessValue = 1;
	let imageData = undefined;
	let canvas = document.getElementsByTagName('canvas')[0];
	var currentRedInput = document.getElementById('current-colour-red');
	var currentGreenInput = document.getElementById('current-colour-green');
	var currentBlueInput = document.getElementById('current-colour-blue');
	var glarePoints;
	var needsUpdating = true;
	let currentColour = {
		'red': 100,
		'green': 10,
		'blue': 5
	};
	let initialDialogOk = document.getElementById('initial-dialog-ok');
	
	function resetGlarePoints() {
		glarePoints = [];
		needsUpdating = true;
	}

	function updateDisplay() {
		if (needsUpdating) {
			let w = canvas.clientWidth;
			let h = canvas.clientHeight;
			if (canvas.getAttribute('width') !== w || canvas.getAttribute('height') !== h) {
				canvas.setAttribute('width', w);
				canvas.setAttribute('height', h);
			}
			let g = canvas.getContext('2d');
			if (imageData === undefined) {
				imageData = g.createImageData(w, h);
			}
			let data = imageData.data;
			let glare = new HumanEyeGlareEffect();
			let multipliedGlarePoints = glarePoints.map(function(point) {
				return {
					'colour': Colour.multiplyScalar(brightnessValue, point.colour),
					'point': point.point
				};
			});
			var c;
			for (var x = 0; x < w; x++) {
				for (var y = 0; y < h; y++) {
					let index = (x + y * w) * 4;
					c = Colour.clone(Colour.BLACK);
					for (var i = 0; i < multipliedGlarePoints.length; i++) {
						let glarePoint = multipliedGlarePoints[i]; 
						let tempC = glare.getColourAt({'x': x - glarePoint.point.x - w * 0.5,
							'y': y - glarePoint.point.y - h * 0.5
							}, glarePoint.colour);
						Colour.inPlaceAdd(c, tempC);
						if (Math.min(c.red, c.green, c.blue) >= 255) {
							break; // no need to continue if we know it'll be white.
						}
					}
					c = glare.chromaticOverflow(c);
					data[index] = Math.max(0, Math.min(255, c.red));
					data[index + 1] = Math.max(0, Math.min(255, c.green));
					data[index + 2] = Math.max(0, Math.min(255, c.blue));
					data[index + 3] = 255;
				}
			}

			g.putImageData(imageData, 0, 0);
		}
		needsUpdating = false;
		requestAnimationFrame(updateDisplay);
	}
	
	function brightnessChanged() {
		brightnessValue = (brightnessInput.value);
		needsUpdating = true;
	}
	
	function resized() {
		imageData = undefined;
		needsUpdating = true;
	}
	
	function addPoint(event) {
	    var x = event.pageX;
		var y = event.pageY;
		if (isNaN(x))
		    x = event.touches[0].pageX;
		if (isNaN(y))
		    y = event.touches[0].pageY;
		x -= this.offsetLeft; 
		y -= this.offsetTop;
		if (typeof x === 'number' && !isNaN(x) && typeof y === 'number' && !isNaN(y)) {
			x -= canvas.getAttribute('width') * 0.5;
			y -= canvas.getAttribute('height') * 0.5;
			glarePoints.push({
				'colour': Colour.clone(currentColour),
				'point': {
					'x': x,
					'y': y
				}
			});
		}
		needsUpdating = true;
	}
	
	function currentColourUpdated() {
		currentColour.red = currentRedInput.value;
		currentColour.green = currentGreenInput.value;
		currentColour.blue = currentBlueInput.value;
	}

	// Initially show 1 point because it looks more interesting than having none.
	glarePoints = [
	{
		'colour': {
			'red': 10,
			'green': 10,
			'blue': 0
		},
		'point': {
			'x': 0,
			'y': 0
		}
	}];
	
	function closeDialog() {
        document.querySelector('.initial-dialog').setAttribute('class', 'hidden');
	}

	brightnessInput.addEventListener('input', brightnessChanged);
	let resetPointsButton = document.getElementById('reset-points');
	initialDialogOk.addEventListener('click', closeDialog);
	resetPointsButton.addEventListener('click', resetGlarePoints);
	currentRedInput.addEventListener('input', currentColourUpdated);
	currentGreenInput.addEventListener('input', currentColourUpdated);
	currentBlueInput.addEventListener('input', currentColourUpdated);
	window.addEventListener('resize', resized);
	canvas.addEventListener('mousedown', addPoint);
	canvas.addEventListener('touchstart', addPoint);

	currentColourUpdated();
	brightnessChanged();
	updateDisplay();
});