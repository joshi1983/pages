import { DataTypes } from '../../../data-types/DataTypes.js';
await DataTypes.asyncInit();

export function convertToDataTypes(dataTypeString) {
	if (typeof dataTypeString === 'string')
		return new DataTypes(dataTypeString);
	else
		throw new Error(`string of the dataTypes format is required but got a non-string value: ${dataTypeString}`);
};