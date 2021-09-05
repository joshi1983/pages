import { DataTypes } from '../../parsing/data-types/DataTypes.js';
import { dataTypesToEnglish } from '../../help/command-details/dataTypesToEnglish.js';

export function getDataTypeDescription(val) {
	const types = DataTypes.getTypesCompatibleWithValue(val);
	return dataTypesToEnglish(types);
};