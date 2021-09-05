import { DataTypes } from
'../../data-types/DataTypes.js';

function likelyHasNestedTypes(types) {
	if (types.indexOf('list<') !== -1 &&
	types.indexOf('>') !== -1)
		return true;

	if (types.indexOf('returntypes') !== -1 &&
	types.indexOf('cproc') !== -1)
		return true;

	return false;
}

export function containsTypeName(types, typeName) {
	if (types === undefined) // undefined represents any and all types so it'll contain any typeName.
		return true;
	if (types === typeName ||
		types.endsWith('|' + typeName) ||
		types.startsWith(typeName + '|') ||
		types.indexOf('|' + typeName + '|') !== -1) {
		if (likelyHasNestedTypes(types)) {
			const dTypes = new DataTypes(types);
			return Array.from(dTypes.types).some(t => t.name === typeName);
		}
		return true;
	}
	return false;
};