export class LineCap {
	static Butt = 0;
	static Square = 1;
	static Round = 2;

	static parse(lineCapName) {
		return lineCaps[lineCapName];
	}

	static getNameFor(lineCap) {
		const keys = Object.keys(LineCap);
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (LineCap[key] === lineCap)
				return key.toLowerCase();
		}
	}

	static getNames() {
		return Object.keys(lineCaps);
	}
};

const lineCaps = {
	'butt': LineCap.Butt,
	'square': LineCap.Square,
	'round': LineCap.Round
};