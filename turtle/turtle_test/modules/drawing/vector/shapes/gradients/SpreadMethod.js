
export class SpreadMethod {
	static Pad = 0;
	static Reflect = 1;
	static Repeat = 2;

	static parse(spreadMethodName) {
		return spreadMethods[spreadMethodName];
	}

	static getNameFor(spreadMethod) {
		const keys = Object.keys(SpreadMethod);
		for (var i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (SpreadMethod[key] === spreadMethod)
				return key.toLowerCase();
		}
	};

	static getNames() {
		return Object.keys(spreadMethods);
	}
};

const spreadMethods = {
	'pad': SpreadMethod.Pad,
	'reflect': SpreadMethod.Reflect,
	'repeat': SpreadMethod.Repeat
};
