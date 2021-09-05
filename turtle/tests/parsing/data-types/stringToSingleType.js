import { DataTypes } from
'../../../modules/parsing/data-types/DataTypes.js';

export function stringToSingleType(typesString, logger) {
	const dt = new DataTypes(typesString);
	if (dt.types.size !== 1) {
		logger(`Expected exactly 1 type from ${typesString} but found ${dt.types.size}`);
		if (dt.types.size === 0)
			throw new Error(`Found 0 types in ${typesString} so unable to return a single type.`);
	}
	return dt.types.values().next().value;
};