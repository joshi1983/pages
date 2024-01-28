/*
Returns the array index of the found value or
returns an object with failingAtIndex indicating the last index checked.
*/
function _binarySearch(array, startIndex, endIndex, compare, targetValue) {
	if (endIndex < startIndex)
		return {
			'failingAtIndex': startIndex
		}; // indicate not found but indicate where the search ended.
	let midIndex = Math.floor((startIndex + endIndex) / 2);
	if (midIndex === startIndex && midIndex < endIndex)
		midIndex ++;
	const compareResult = compare(targetValue, array[midIndex]);
	if (compareResult === 0)
		return midIndex; // found
	else if (endIndex === startIndex)
		return {
			'failingAtIndex': startIndex
		};
	else if (compareResult > 0)
		return _binarySearch(array, midIndex + 1, endIndex, compare, targetValue);
	else
		return _binarySearch(array, startIndex, midIndex - 1, compare, targetValue);
};

export function binarySearch(array, compare, targetValue, returnNumberOnly) {
	const result = _binarySearch(array, 0, array.length - 1, compare, targetValue);
	if (returnNumberOnly && typeof result === 'object') {
		return result.failingAtIndex;
	}
	return result;
};