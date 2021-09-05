import { DataTypes } from
'../../data-types/DataTypes.js';

export function typesStrToSingleDataType(s) {
	const types = new DataTypes(s).types;
	if (types.size !== 1)
		return;

	return types.values().next().value;
};