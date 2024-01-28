import { DataTypes } from './DataTypes.js';

export function unionDataTypesArray(dataTypesArray) {
	if (!(dataTypesArray instanceof Array))
		throw new Error(`dataTypesArray must be an Array.  Not: ${dataTypesArray}`);
	if (dataTypesArray.length === 1) // frequent case
		return new DataTypes(dataTypesArray[0]); 
		// return clone to protect DataTypes from accidental mutation.

	const result = new DataTypes();
	for (let i = 0; i < dataTypesArray.length; i++) {
		result.addTypes(dataTypesArray[i]);
	}
	return result;
};