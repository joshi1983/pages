export class FontWeight {
	static Normal = 0;
	static Bold = 1;
	/*
	I considered supporting bolder and lighter font weights but
	I couldn't solve the problem discussed at:
	https://stackoverflow.com/questions/64583689/setting-font-weight-on-canvas-text

	The following documentation doesn't resolve the problem either:
	https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font

	Setting the font property on an HTML5 canvas 2d context, doesn't seem to work as intended for bolder and lighter.
	Until that problem gets solved, normal and bold are the only sufficiently working alternatives in WebLogo.
	*/

	static parse(fontWeightName) {
		return fontWeights[fontWeightName];
	}

	static getNameFor(fontWeight) {
		const keys = Object.keys(FontWeight);
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (FontWeight[key] === fontWeight)
				return key.toLowerCase();
		}
	};

	static getNames() {
		return Object.keys(fontWeights);
	}
};

const fontWeights = {
	'bold': FontWeight.Bold,
	'normal': FontWeight.Normal
};