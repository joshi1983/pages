import { DataTypes } from '../parsing/data-types/DataTypes.js';
await DataTypes.asyncInit();

const dataTypes = DataTypes.typesArray;

export function dataTypeNameToHelpUrl(formalName) {
	for (let i = 0; i < dataTypes.length; i++) {
		const dataType = dataTypes[i];
		if (dataType.name === formalName)
			return dataType.constructor.helpUrl;
	}
}