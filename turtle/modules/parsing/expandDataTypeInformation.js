import { DataTypes } from './data-types/DataTypes.js';

export async function expandDataTypeInfoInit() {
	await DataTypes.asyncInit();
};

function expandLengths(argInfo) {
	const dataTypes = new DataTypes(argInfo.types);
	let minLen;
	for (const type of dataTypes.types) {
		if (type.minLen !== undefined) {
			if (minLen !== undefined && type.minLen !== minLen)
				return;
			minLen = type.minLen;
		}
	}
	if (minLen !== undefined && minLen > 0)
		argInfo.minLen = minLen;
}

export function expandDataTypeInformation(commandInfo) {
	for (const argInfo of commandInfo.args) {
		expandLengths(argInfo);
	}
};