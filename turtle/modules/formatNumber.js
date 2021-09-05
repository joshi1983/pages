export function formatNumber(val, maxDecimals) {
	let result = val.toFixed(maxDecimals);
	while (result !== '0' && result.endsWith('0'))
		result = result.substring(0, result.length - 1);
	if (result.endsWith('.'))
		result = result.substring(0, result.length - 1);
	if (result === '-0')
		return '0';
	return result;
}