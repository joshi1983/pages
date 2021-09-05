export class ArrayUtils {
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
};