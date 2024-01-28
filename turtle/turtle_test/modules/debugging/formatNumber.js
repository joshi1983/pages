export function formatNumber(num) {
	let precision = Math.min(4, Math.max(0, Math.ceil(-Math.log10(Math.abs(num)))));
	if (precision < 4) {
		const result = num.toFixed(precision + 1);
		if (result.endsWith('.0'))
			return result.substring(0, result.length - 2); // remove the trailing '.0'.
		else if (result.endsWith('0'))
			return result.substring(0, result.length - 1); // remove the trailing '0'.
		else
			return result;
	}
	let result = num.toFixed(precision);
	while (result.endsWith('0')) {
		result = result.substring(0, result.length - 1);
		if (result.endsWith('.')) {
			result = result.substring(0, result.length - 1);
			break;
		}
	}
	if (result === '-0')
		return '0';
	return result;
};