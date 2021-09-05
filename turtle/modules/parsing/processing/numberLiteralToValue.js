function hexToNumber(val) {
	return parseInt(val, 16);
}

export function numberLiteralToValue(val) {
	val = val.toLowerCase();
	if (val.startsWith('#'))
		return hexToNumber(val.substring(1));
	if (val.startsWith('0x'))
		return hexToNumber(val.substring(2));
	return parseFloat(val);
}