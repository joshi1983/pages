export class MaybeDecided {
	static Yes = 1;
	static Maybe = 2;
	static No = 3;

	static stringify(val) {
		if (val === undefined)
			return 'undefined';
		else {
			const keys = Object.keys(MaybeDecided);
			for (var i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (MaybeDecided[key] === val)
					return key;
			}
		}
	}

	static isMaybeDecidedValue(val) {
		return [MaybeDecided.Yes, MaybeDecided.No, MaybeDecided.Maybe].indexOf(val) !== -1;
	}
};