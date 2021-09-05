import { ArrayUtils } from '../ArrayUtils.js';
import { DataTypes } from './data-types/DataTypes.js';
import { fetchJson } from '../fetchJson.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { sanitizeCompositeValidation } from './sanitizeCompositeValidation.js';
let commands;
let commandMap;
let hintCommandMap;

async function asyncInit() {
	commands = await fetchJson('json/commands.json');
	await DataTypes.asyncInit();
	commandMap = new Map();
	hintCommandMap = new Map();

	commands.forEach(function(commandInfo) {
		commandMap.set(commandInfo.primaryName.toLowerCase(), commandInfo);
		commandInfo.names.forEach(function(name) {
			commandMap.set(name, commandInfo);
		});
		if (commandInfo.hintNames !== undefined)
			commandInfo.hintNames.forEach(function(hintName) {
				hintCommandMap.set(hintName, commandInfo);
			});
		commandInfo.args.forEach(function(argInfo) {
			if (argInfo.format === 'stepPosition')
				argInfo.sanitization = 'convertToStepPosition';
		});
		sanitizeCompositeValidation(commandInfo);
	});
}
const initPromise = asyncInit();
export class Command {
	static asyncInit() {
		return initPromise;
	}

	constructor(commandName, args) {
		if (typeof commandName !== 'string')
			throw new Error('commandName must be a string.');
		if (!(args instanceof Array))
			throw new Error('args must be an Array.');
		args.forEach(function(arg, index) {
			if (!(arg instanceof ParseTreeToken))
				throw new Error('All elements of args must be ParseTreeToken.');
		});

		this.name = commandName;
		this.args = args;
	}

	static getAllCommandsInfo() {
		return commands;
	}

	static getArgCount(commandInfo) {
		if (typeof commandInfo === 'string') {
			const name = commandInfo;
			commandInfo = Command.getCommandInfo(name);
			if (commandInfo === undefined)
				throw new Error('Unrecognized command: ' + name);
		}
		const result = {
			'isFlexible': commandInfo.argCount === '?' || typeof commandInfo.argCount === 'object',
			'defaultCount': commandInfo.args.length
		};
		if (typeof commandInfo.argCount === 'object') {
			Object.assign(result, commandInfo.argCount);
		}
		return result;
	}

	static getCommandInfo(commandName) {
		if (typeof commandName !== 'string')
			throw new Error('getCommandInfo requires a string for commandName.  Not: ' + commandName);
		commandName = commandName.toLowerCase();
		if (commandMap.has(commandName))
			return commandMap.get(commandName);
	}

	static getCommandInfoByHintName(hintName) {
		if (typeof hintName !== 'string')
			throw new Error('hintName must be a string.  Not: ' + hintName);

		hintName = hintName.toLowerCase();
		return hintCommandMap.get(hintName);
	}

	static getCommandsMatchingSearchKeywords(keywords) {
		return commands.filter(function(info) {
			if (info.searchKeywords === undefined)
				return false;
			for (let i = 0; i < keywords.length; i++) {
				if (!info.searchKeywords.some(w => w === keywords[i])) {
					return false;
				}
			}
			return true;
		});
	}

	static getCommandsWithFormat() {
		return commands.filter(c => c.args.some(a => a.format !== undefined));
	}

	static getCommandsWithInstructionLists() {
		return commands.filter(c => c.args.some(a => a.types === 'instructionlist'));
	}

	static getCommandsWithReadCommand() {
		return commands.filter(c => c.readCommand !== undefined);
	}

	static getCommandsWithTypeEqualitySymbols() {
		return commands.filter(c => c.args.some(a => a.typeEqualitySymbol !== undefined));
	}

	static getCommandsWithVariableRefTypes() {
		return commands.filter(c => c.args.some(a => a.refTypes !== undefined));
	}

	static getLowerCaseCommandNameSet(commandInfo) {
		if (typeof commandInfo === 'string') // command name instead of info object
			commandInfo = Command.getCommandInfo(commandInfo);
		const result = [commandInfo.primaryName.toLowerCase()];
		ArrayUtils.pushAll(result, commandInfo.names);
		return new Set(result);
	}

	static getMethodNameFor(commandInfo) {
		return commandInfo.primaryName.replace(/\./g, '_');
	}

	static getParameterInfo(commandInfo, parameterIndex) {
		if (parameterIndex >= 0 && parameterIndex < commandInfo.args.length)
			return commandInfo.args[parameterIndex];
		else
			return {
				'name': '_',
				'types': '',
			};
	}

	static getParameterName(commandInfo, parameterIndex) {
		if (typeof commandInfo === 'string')
			commandInfo = Command.getCommandInfo(commandInfo);
		if (parameterIndex >= 0 && parameterIndex < commandInfo.args.length)
			return commandInfo.args[parameterIndex].name;
	}

	static getParameterRefTypes(commandInfo, parameterIndex) {
		if (typeof commandInfo === 'string')
			commandInfo = Command.getCommandInfo(commandInfo);
		if (parameterIndex >= 0 && parameterIndex < commandInfo.args.length)
			return commandInfo.args[parameterIndex].refTypes;
	}

	static getParameterTypes(commandInfo, parameterIndex) {
		if (typeof commandInfo === 'string')
			commandInfo = Command.getCommandInfo(commandInfo);
		if (parameterIndex >= 0 && parameterIndex < commandInfo.args.length)
			return commandInfo.args[parameterIndex].types;
		else
			return DataTypes.getAllTypesString(); // return all types
	}

	static getReturnDataTypes(commandInfo) {
		return new DataTypes(commandInfo.returnTypes);
	}

	static getReturnTypes(commandInfo) {
		return commandInfo.returnTypes;
	}
};

