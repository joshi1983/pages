import { DataType } from './DataType.js';
import { DataTypes } from './DataTypes.js';
import { asyncInit as kAsyncInit, isDataTypeContainingUsingKey } from './isDataTypeContainingUsingKey.js';

// The caller must also ensure DataTypes.asyncInit() resolves too.
// DataTypes.asyncInit() is not included here because DataTypes.asyncInit depends on this.
export async function asyncInit() {
	await kAsyncInit();
};

/*
DataTypes is passed in to prevent a module import cycle that prevents the modules from loading properly.
*/
export function isDataTypeContaining(dataType1, dataType2) {
	if (!(dataType1 instanceof DataType))
		throw new Error(`dataType1 must be a DataType but got ${dataType1}`);
	if (!(dataType2 instanceof DataType))
		throw new Error(`dataType2 must be a DataType but got ${dataType2}`);
	const keyResult = isDataTypeContainingUsingKey(dataType1, dataType2);
	if (keyResult !== undefined)
		return keyResult;
	return DataTypes.contains(new Set([dataType1]), dataType2);
};