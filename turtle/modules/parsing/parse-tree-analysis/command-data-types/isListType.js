const listTypeNames = new Set([
'alphacolorlist',
'colorlist', 'list',
'list<bool>', 'list<int>', 'list<list>', 'list<num>', 'list<string>']);

export function isListType(type) {
	return listTypeNames.has(type);
};