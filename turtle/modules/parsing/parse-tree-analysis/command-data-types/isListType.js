const listTypeNames = new Set(['alphacolorlist', 'colorlist', 'list']);

export function isListType(type) {
	return listTypeNames.has(type);
};