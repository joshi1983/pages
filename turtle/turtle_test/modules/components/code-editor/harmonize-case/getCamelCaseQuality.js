
/*
Is s using camelcase?
The answer would be simply true or false.

To what degree is s camelcase?
That's the answer getCamelCaseQuality(s) tries to calculate.  The return value is a number.  
A higher value indicates closer to camelcase.

Returns a value that is maximized if s is camelCase with 4 times more lower case than upper case.
*/
export function getCamelCaseQuality(s) {
	if (s.toLowerCase() === s.toUpperCase())
		return 0; // case doesn't matter.

	let result = 0;
	const c = s.charAt(0);
	if (c.toLowerCase() !== c.toUpperCase()) {
		if (c.toLowerCase() === c)
			result += s.length;
		else
			result -= s.length;
	}
	let numCapitals = 0;
	let numLowerCase = 0;
	for (let i = 0; i < s.length; i++) {
		const ch = s.charAt(i);
		if (ch.toLowerCase() !== ch.toUpperCase()) {
			if (ch.toUpperCase() === ch)
				numCapitals ++;
			else
				numLowerCase ++;
		}
	}
	if (numCapitals !== 0 || numLowerCase !== 0) {
		const capitalRatio = numCapitals / (numCapitals + numLowerCase);
		const idealRatio = 0.25;
		const caseRatioDelta = Math.abs(idealRatio - capitalRatio);
		// Add a value that is maximum when the capital vs lower case ratio is closest to 0.25.
		result += s.length * (1 - caseRatioDelta);
	}
	return result;
};