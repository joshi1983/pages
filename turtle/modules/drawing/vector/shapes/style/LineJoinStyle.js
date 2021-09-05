export class LineJoinStyle {
	static Miter = 0;
	static Round = 1;
	static Bevel = 2;

	static parse(lineJoinStyleName) {
		return lineJoinStyles[lineJoinStyleName];
	}

	static getNameFor(lineJoinStyle) {
		const keys = Object.keys(LineJoinStyle);
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (LineJoinStyle[key] === lineJoinStyle)
				return key.toLowerCase();
		}
	};

	static getNames() {
		return Object.keys(lineJoinStyles);
	}
};


const lineJoinStyles = {
	'miter': LineJoinStyle.Miter,
	'round': LineJoinStyle.Round,
	'bevel': LineJoinStyle.Bevel
};
