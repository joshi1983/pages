import { Command } from '../Command.js';

function butFirstAndButLast(parameterTypes) {
	if (parameterTypes === 'list' || parameterTypes === 'string')
		return parameterTypes;
	if (parameterTypes.indexOf('list') !== -1 && parameterTypes.indexOf('string') !== -1)
		return 'list|string';
	if (parameterTypes.indexOf('string') !== -1)
		return 'string';
	if (parameterTypes.indexOf('list') !== -1)
		return 'list';
	return 'list|string';
}

const commands = {
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
	'sum': function() {
		for (let i = 0; i < arguments.length; i++) {
			if (arguments[i] !== 'int')
				return 'num';
		}
		return 'int';
	}
};

export class CommandDataTypes {
	static isReturnTypesAffectedByInputTypes(commandName) {
		const info = Command.getCommandInfo(commandName);
		return info !== undefined && commands[info.primaryName] !== undefined;
	}

	static getReturnDataTypesFromInputs(commandName, parameterTypesArray) {
		const info = Command.getCommandInfo(commandName);
		commandName = info.primaryName;
		if (commands[commandName] !== undefined)
			return commands[commandName](...parameterTypesArray);
		else
			return info.returnTypes;
	}
};