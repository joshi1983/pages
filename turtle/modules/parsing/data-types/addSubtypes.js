import { DataListType } from './DataListType.js';
import { DataTypes } from './DataTypes.js';

function getListType(dataTypes) {
	if (dataTypes instanceof DataTypes)
		dataTypes = dataTypes.types;
	for (const type of dataTypes) {
		if (type.name === 'list')
			return type;
	}
}

export function addSubtypes(dataTypes, newSubtypes) {
	if ((newSubtypes instanceof DataTypes && newSubtypes.isEmpty()) ||
	newSubtypes.size === 0 || newSubtypes.length === 0)
		return; // nothing to add.
	if (!(dataTypes instanceof DataTypes))
		throw new Error(`dataTypes must be a DataTypes but got ${dataTypes}`);
	const listType = getListType(dataTypes);
	if (listType === undefined) {
		dataTypes.addTypes(new Set([new DataListType(newSubtypes)]));
	}
	else if (listType.subtypes !== undefined) {
		// if listType.subtypes is undefined, there is nothing to add because undefined means all data types.
		listType.subtypes.addTypes(newSubtypes);
	}
};