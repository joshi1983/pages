import { DataTypes } from '../parsing/data-types/DataTypes.js';
await DataTypes.asyncInit();

export function helpUrlToFormalName(helpUrl) {
	const types = DataTypes.typesArray;
	for (let i = 0; i < types.length; i++) {
		const type = types[i];
		if (type.constructor.helpUrl === helpUrl) {
			return type.name;
		}
	}
};