import { Command } from '../../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { parseDataTypeString } from '../../../data-types/data-type-parsing/parseDataTypeString.js';
import { PythonFunctions } from '../../PythonFunctions.js';
await Command.asyncInit();

const boolType = new DataTypes('bool');
const numType = new DataTypes('num');
const listType = new DataTypes('list');
const stringType = new DataTypes('string');
const stringToTypeMap = new Map([
	['bool', boolType],
	['list', listType],
	['num', numType],
	['string', stringType]
]);
const simplifiedTypes = new Map([]);
function simplify(s) {
	if (typeof s === 'string' && s !== '*') {
		if (!simplifiedTypes.has(s)) {
			const token = parseDataTypeString(s);
			let simplified = token.children.map(child => child.val).join('|');
			simplifiedTypes.set(s, simplified);
		}
	}
}

Command.getAllCommandsInfo().forEach(function(commandInfo) {
	simplify(commandInfo.returnTypes);
});

export function setTypesForFunctionCalls(tokens, result) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (!result.has(token)) {
			const funcInfo = PythonFunctions.getFunctionInfo(token.val);
			if (funcInfo !== undefined && (typeof funcInfo.translateToCommand === 'string' ||
			typeof funcInfo.returnTypes === 'string')) {
				let simplifiedTypeString = funcInfo.returnTypes;
				if (simplifiedTypeString === undefined && funcInfo.isTranslatedToProcedure !== true) {
					const commandInfo = Command.getCommandInfo(funcInfo.translateToCommand);
					simplifiedTypeString = simplifiedTypes.get(commandInfo.returnTypes);
				}
				if (stringToTypeMap.has(simplifiedTypeString))
					result.set(token, stringToTypeMap.get(simplifiedTypeString));
			}
		}
	}
};