const stringNames = new Set([
	'string', 'string(minlen=1)', 'string(minlen=2)', 'string(minlen=3)'
]);

export function isString(dataTypeStr) {
	if (stringNames.has(dataTypeStr))
		return true;
	if (dataTypeStr.startsWith('string(') && dataTypeStr.endsWith(')') &&
	dataTypeStr.indexOf('|') === -1)
		return true;
	return false;
};