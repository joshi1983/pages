export class OutputFrequency {
	static Always = 1;
	static Sometimes = 2;
	static Never = 3;

	static stringify(val) {
		if (val === undefined)
			return 'undefined';
		else {
			const keys = Object.keys(OutputFrequency);
			for (var i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (OutputFrequency[key] === val)
					return key;
			}
		}
	}
};