import { AlphaColorType } from './AlphaColorType.js';
import { ColorType } from './ColorType.js';
import { DataType } from './DataType.js';
import { DataTypes } from './DataTypes.js';
import { asyncInit as isDataTypeContainingUsingKeyAsyncInit, isDataTypeContainingUsingKey }
from './isDataTypeContainingUsingKey.js';

// The caller should await DataTypes.asyncInit() separately.
export async function asyncInit() {
	await isDataTypeContainingUsingKeyAsyncInit();
};

export function areDataTypesContaining(dataTypes, otherTypeOrTypes) {
	if (dataTypes instanceof DataType)
		throw new Error(`dataTypes must not be a DataType but got ${dataTypes}.  It must either be a Set or a DataTypes instance.`);
	else if (dataTypes instanceof DataTypes)
		dataTypes = dataTypes.types;
	if (!(dataTypes instanceof Set)) {
		console.error('dataTypes = ', dataTypes);
		throw new Error('dataTypes must be a DataTypes or Set containing DataType instances');
	}
	if (otherTypeOrTypes instanceof DataType) {
		if (dataTypes.size === 1) {
			const keyResult = isDataTypeContainingUsingKey(dataTypes.values().next().value, otherTypeOrTypes);
			if (keyResult !== undefined)
				return keyResult;
		}
		if (otherTypeOrTypes.name === 'color') {
			otherTypeOrTypes = ColorType.getSubtypeSet();
		}
		else if (otherTypeOrTypes.name === 'alphacolor') {
			otherTypeOrTypes = AlphaColorType.getSubtypeSet();
		}
		else {
			const otherType = otherTypeOrTypes;
			if (dataTypes.has(otherType))
				return true;
			for (let t of dataTypes) {
				if (otherType.isSubsetOf(t, DataTypes)) {
					return true;
				}
			}
			return false;
		}
	}
	if (otherTypeOrTypes instanceof Set) {
		for (let t of otherTypeOrTypes) {
			if (!DataTypes.contains(dataTypes, t))
				return false;
		}
		return true;
	}
	else {
		console.error('otherTypeOrTypes = ', otherTypeOrTypes);
		throw new Error(`otherTypeOrTypes must either be a DataType or a Set containing DataType instances but got ${otherTypeOrTypes}`);
	}
};