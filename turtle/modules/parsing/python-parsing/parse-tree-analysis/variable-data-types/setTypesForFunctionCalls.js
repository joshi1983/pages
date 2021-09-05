import { Command } from '../../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { PythonFunctions } from '../../PythonFunctions.js';

const numType = new DataTypes('num');
const listType = new DataTypes('list');

export function setTypesForFunctionCalls(tokens, result) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (!result.has(token)) {
			const funcInfo = PythonFunctions.getFunctionInfo(token.val);
			if (funcInfo !== undefined && typeof funcInfo.translateToCommand === 'string') {
				const commandInfo = Command.getCommandInfo(funcInfo.translateToCommand);
				if (commandInfo.returnTypes === 'num')
					result.set(token, numType);
				else if (commandInfo.returnTypes === 'list')
					result.set(token, listType);
			}
		}
	}
};