import { DataTypes } from '../../modules/parsing/data-types/DataTypes.js';

await DataTypes.asyncInit();
const types = DataTypes.getAssignableTypesArray();
const s = new DataTypes(types).toString();

export function getAllAssignableDataTypesString() {
	return s;
};