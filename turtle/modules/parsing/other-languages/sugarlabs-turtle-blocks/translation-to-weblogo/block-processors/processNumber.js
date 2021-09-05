// expected elementInfo[0] to be "number"
export function processNumber(elementInfo, result) {
	let num;
	let pair = elementInfo[1];
	if ((pair instanceof Array) && pair.length === 2) {
		num = pair[1];
		if (typeof num === 'object' &&
		num !== null &&
		typeof num.value === 'number') {
			num = num.value;
		}
	}
	if (typeof num === 'number')
		result.append(` ${num} `);
};