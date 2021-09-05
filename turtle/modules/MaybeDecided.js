/*
This is for a concept called ternary logic.

The boolean type is great for conventional decisions.

Sometimes people use undefined or null to represent something like "maybe".
This class/enum represents the maybe by Maybe.  
undefined or null seem less clear than putting the word "Maybe" in your code.
This is important for difficult or impossible to always solve decision problems.
*/
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