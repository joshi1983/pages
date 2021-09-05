export class ArrayUtils {
	static indexOfMatch(a, isMatch) {
		for (let i = 0; i < a.length; i++) {
			if (isMatch(a[i]))
				return i;
		}
		return -1;
	}

	static pushAll(a, fromArray) {
		/*
		Not using a.push(...fromArray); because that would perform slower and 
		throw a stack overflow if fromArray.length was roughly 100,000.
		*/
		for (let i = 0; i < fromArray.length; i++) {
			a.push(fromArray[i]);
		}
	}

	static remove(a, isKept) {
		const newElements = a.filter(e => isKept(e));
		a.length = 0;
		/* A loop is used below instead of a.push(...newElements) for better performance 
		and to not be limited to 60,000 or so length arrays.
		*/
		for (let i = 0; i < newElements.length; i++) {
			a[i] = newElements[i];
		}
	}

	static repeat(a, numRepeats) {
		const result = [];
		for (let i = 0; i < numRepeats; i++) {
			for (let j = 0; j < a.length; j++) {
				result.push(a[j]);
			}
		}
		return result;
	}

	static rotateLeft(a, numRotations) {
		if (a.length === 0)
			return;// nothing to rotate
		numRotations = numRotations % a.length;
		if (numRotations === 0)
			return; // nothing to do.
		const elements = a.slice(0, numRotations);
		a.splice(0, numRotations); // remove first elements.
		a.push(...elements);
	}

	static rotateRight(a, numRotations) {
		if (a.length === 0)
			return;// nothing to rotate
		numRotations = numRotations % a.length;
		if (numRotations === 0)
			return; // nothing to do.
		const elements = a.slice(a.length - numRotations);
		a.length = a.length - numRotations;
		a.unshift(...elements); // insert elements at start.
	}
};