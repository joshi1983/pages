export function containsTypeName(types, typeName) {
	if (types === undefined) // undefined represents any and all types so it'll contain any typeName.
		return true;
	return types === typeName ||
		types.endsWith('|' + typeName) ||
		types.startsWith(typeName + '|') ||
		types.indexOf('|' + typeName + '|') !== -1;
};