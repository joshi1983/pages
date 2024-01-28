const keyToIntMap = new Map();

export class StepPosition {
	static JumpStart = 0;
	static JumpEnd = 1;
	static JumpNone = 2;
	static JumpBoth = 3;

	static getNameFor(intVal) {
		const keys = Object.keys(StepPosition);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (StepPosition[key] === intVal)
				return key;
		}
	}

	static getNames() {
		return Object.keys(StepPosition).filter(key => Number.isInteger(StepPosition[key]));
	}

	// Converts strings like 'jumpstart' into corresponding integers.
	static parse(s) {
		s = s.trim().toLowerCase();
		return keyToIntMap.get(s);
	}
};

const keys = Object.keys(StepPosition).filter(key => Number.isInteger(StepPosition[key]));
keys.forEach(key => keyToIntMap.set(key.toLowerCase(), StepPosition[key]));