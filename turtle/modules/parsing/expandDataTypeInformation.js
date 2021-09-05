import { DataTypes } from './data-types/DataTypes.js';

export async function expandDataTypeInfoInit() {
	await DataTypes.asyncInit();
};

function expandLengthsAndListElementTypes(argInfo) {
	const dataTypes = new DataTypes(argInfo.types);
	let listElementTypes;
	let minLen;
	let doNotSetListElementTypes = false;
	for (const type of dataTypes.types) {
		if (type.minLen !== undefined) {
			if (minLen !== undefined && type.minLen !== minLen)
				return;
			minLen = type.minLen;
		}
		if (type.subtypes !== undefined && !doNotSetListElementTypes) {
			if (listElementTypes !== undefined) {
				doNotSetListElementTypes = true;
				// This would be a weird case.  It would mean there is more than 1 list data type in the types information.
				// Do not set the listElementTypes because it isn't clear enough what the types should be.
			}
			else
				listElementTypes = DataTypes.stringify(type.subtypes);
		}
	}
	if (minLen !== undefined && minLen > 0)
		argInfo.minLen = minLen;
	if (listElementTypes !== undefined && !doNotSetListElementTypes)
		argInfo.listElementTypes = listElementTypes;
}

export function expandDataTypeInformation(commandInfo) {
	for (const argInfo of commandInfo.args) {
		expandLengthsAndListElementTypes(argInfo);
	}
};