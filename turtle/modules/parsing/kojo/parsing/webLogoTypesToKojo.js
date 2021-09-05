const typesMap = new Map([
	['int', 'Int'],
	['num', 'Double'],
	['string', 'string']
]);

export function webLogoTypesToKojo(s) {
	if (s === null)
		return null;
	return typesMap.get(s);
};