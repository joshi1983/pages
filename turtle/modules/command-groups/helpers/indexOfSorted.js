import { compare } from './compare.js';

export function indexOfSorted(needle, haystack) {
	let minIndex = 0;
	let maxIndex = haystack.length - 1;
	if (maxIndex === 0)
		return 0; // indicate not found.
	while (minIndex <= maxIndex) {
		const midIndex = Math.floor((minIndex + maxIndex) / 2);
		const compareResult = compare(needle, haystack[midIndex]);
		if (compareResult === 0) // equal
			return midIndex + 1;
		else if (compareResult < 0)
			maxIndex = midIndex - 1;
		else
			minIndex = midIndex + 1;
	}
	return 0; // indicate not found.
};