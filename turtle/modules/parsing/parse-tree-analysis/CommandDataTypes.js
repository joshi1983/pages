import { Command } from '../Command.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { removeNull } from '../data-types/removeNull.js';

const alphaColorNames = new Set(['alphacolor', 'alphacolorlist', 'alphacolorlist|colorlist',
'alphacolorstring', 'color', 'colorlist', 'colorstring', 'int']);
const listTypeNames = new Set(['alphacolorlist', 'colorlist', 'list']);
const mixTransparentTypes = new Set(['transparent', 'string|transparent', 
		'alphacolorstring|transparent', 'colorstring|transparent']);
const colorTypes = new Set(['color', 'colorstring', 'colorlist']);
const stransparentTypes = new Set(['alphacolorstring', 'alphacolorstring|colorstring|transparent',
'alphacolorstring|transparent', 'colorstring', 'colorstring|transparent', 'string', 'string|transparent']);

function butFirstAndButLast(parameterTypes) {
	if (parameterTypes === 'list' || parameterTypes === 'string')
		return parameterTypes;
	if (parameterTypes === undefined)
		return 'list|string';
	if (parameterTypes.indexOf('string') !== -1) {
		if (parameterTypes.indexOf('list') !== -1)
			return 'list|string';
		return 'string';
	}
	if (parameterTypes.indexOf('list') !== -1)
		return 'list';
	return 'list|string';
}

function containsTypeName(types, typeName) {
	if (types === undefined) // undefined represents any and all types so it'll contain any typeName.
		return true;
	return types === typeName ||
		types.endsWith('|' + typeName) ||
		types.startsWith(typeName + '|') ||
		types.indexOf('|' + typeName + '|') !== -1;
}

function intersectsWithNum(types) {
	return isNum(types) ||
		containsTypeName(types, 'num') ||
		containsTypeName(types, 'int') ||
		containsTypeName(types, 'color') ||
		containsTypeName(types, 'alphacolor');
}

function isStrictlyColor(types) {
	return colorTypes.has(types);
}

function isStrictlyColorOrNum(types) {
	return isStrictlyColor(types) || isNum(types);
}

function isAlphaColor(type) {
	return alphaColorNames.has(type);
}

function isListType(type) {
	return listTypeNames.has(type);
}

function isNum(type) {
	return type === 'int' ||
		type === 'num';
}

function isMixTransparentType(types) {
	return mixTransparentTypes.has(types) ||
		containsTypeName(types, 'transparent');
}

function isStransparent(types) {
	return stransparentTypes.has(types);
}

/*
Each method calculates return types based on parameter types.
*/
const commandGetReturnTypes = {
	'abs': function(parameterTypes) {
		if (parameterTypes === 'int')
			return 'int';
		else
			return 'num';
	},
	'butFirst': butFirstAndButLast,
	'butLast': butFirstAndButLast,
	'difference': function(num1Types, num2Types) {
		if (num1Types === 'int' && num2Types === 'int')
			return 'int';
		else
			return 'num';
	},
	'mix': function(types1, types2) {
		if (isNum(types1) && isNum(types2))
			return 'num';
		else if (isStrictlyColorOrNum(types1) && isStrictlyColorOrNum(types2)) {
			if (intersectsWithNum(types1) && intersectsWithNum(types2))
				return 'colorlist|num';
			return 'colorlist';
		}
		else if (isMixTransparentType(types2) ||
		isAlphaColor(types1) || isAlphaColor(types2)) {
			if (intersectsWithNum(types1) && intersectsWithNum(types2))
				return 'alphacolorlist|num';
			return 'alphacolorlist';
		}
		else if (isListType(types1) || isListType(types2)) {
			if (intersectsWithNum(types1) && intersectsWithNum(types2))
				return 'list|num';
			return 'list';
		}
		else if (isStransparent(types1) || isStransparent(types2))
			return 'alphacolorlist';
		else
			return 'list|num';
	},
	'power': function(types1, types2) {
		if (types1 === 'int' && types2 === 'int')
			return 'int';
		else
			return 'num';
	},
	'sum': function() {
		for (let i = 0; i < arguments.length; i++) {
			if (arguments[i] !== 'int')
				return 'num';
		}
		return 'int';
	}
};

const commandGetParameterTypes = {
	"mix": function(index, getTypesForParameter) {
		if (index === 2)
			return 'num'; // third parameter is always num.

		const otherIndex = (index + 1) % 2;
		const otherTypes = getTypesForParameter(otherIndex);
		if (index === 0 && isMixTransparentType(otherTypes))
			return 'alphacolor';
		if (index === 1 && isNum(otherTypes))
			return 'alphacolor|num|transparent';
		// if otherTypes is a number, it can be interpretted 
		// as a color or a number.
		if (!isNum(otherTypes)) {
			if (isAlphaColor(otherTypes))
				return 'alphacolor';
			if (otherTypes === 'list')
				return 'list';
		}
		if (index === 1)
			return 'alphacolor|list|num|transparent';
		else
			return 'alphacolor|list|num';
	}
};

export class CommandDataTypes {
	static isReturnTypesAffectedByInputTypes(commandName) {
		const info = Command.getCommandInfo(commandName);
		return info !== undefined && commandGetReturnTypes[info.primaryName] !== undefined;
	}

	static getReturnDataTypesFromInputs(commandName, parameterTypesArray) {
		const info = Command.getCommandInfo(commandName);
		commandName = info.primaryName;
		if (commandGetReturnTypes[commandName] !== undefined) {
			for (let i = 0; i < parameterTypesArray.length; i++) {
				let requiredTypes = new DataTypes(Command.getParameterTypes(info, i));
				const actualParamTypes = removeNull(parameterTypesArray[i]);
				requiredTypes.intersectWith(new DataTypes(actualParamTypes));
				parameterTypesArray[i] = requiredTypes.toString();
			}
			return commandGetReturnTypes[commandName](...parameterTypesArray);
		}
		else
			return info.returnTypes;
	}

	static getCommandNamesWhereRequiredParameterTypesAffectEachOther() {
		return Object.keys(commandGetParameterTypes);
	}

	static getRequiredParameterTypes(commandName, parameterIndex, getTypesForParameter) {
		const info = Command.getCommandInfo(commandName);
		commandName = info.primaryName;
		if (commandGetParameterTypes[commandName] !== undefined)
			return commandGetParameterTypes[commandName](parameterIndex, getTypesForParameter);
		else
			return info.returnTypes;
	}
};