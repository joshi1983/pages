const golangTypes = new Map([
	['bool', 'bool'],
	['int', 'int'],
	['num', 'float32'],
	['list', '[]'],
	['string', 'string']
]);

export function convertWebLogoTypesToGolang(s) {
	return golangTypes.get(s);
};