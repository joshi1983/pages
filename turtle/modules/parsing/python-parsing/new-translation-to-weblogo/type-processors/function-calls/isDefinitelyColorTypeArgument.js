import { Command } from '../../../../Command.js';
import { DataTypes } from '../../../../data-types/DataTypes.js';
await Command.asyncInit();
await DataTypes.asyncInit();
const colorIndexes = new Map();
const colourTypesBasicSet = new Set([
'alphacolor', 'alphacolor|transparent', 'color', 'color|transparent'
]);
const stringType = new DataTypes('string');
const colorStringType = new DataTypes('colorstring');
function isColourTypes(types) {
	if (colourTypesBasicSet.has(types))
		return true;
	if (types.indexOf('color') === -1)
		return false;
	const dataTypes = new DataTypes(types);
	if (DataTypes.contains(dataTypes, stringType.types))
		return false;
	if (!dataTypes.hasIntersectionWith(colorStringType))
		return false;
	return true;
}

Command.getAllCommandsInfo().forEach(function(commandInfo) {
	const indexes = [];
	for (let i = 0; i < commandInfo.args.length; i++) {
		const argInfo = commandInfo.args[i];
		if (isColourTypes(argInfo.types)) {
			indexes.push(i);
		}
	}
	if (indexes.length > 0) {
		const lowerCaseNames = Command.getLowerCaseCommandNameSet(commandInfo);
		for (const name of lowerCaseNames) {
			colorIndexes.set(name, indexes);
		}
	}
});

export function isDefinitelyColorTypeArgument(commandName, parameterIndex) {
	const indexes = colorIndexes.get(commandName.toLowerCase());
	if (indexes === undefined)
		return false;
	return indexes.indexOf(parameterIndex) !== -1;
};