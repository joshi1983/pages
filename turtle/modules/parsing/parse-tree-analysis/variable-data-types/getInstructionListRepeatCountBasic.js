import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

export function getInstructionListRepeatCountBasic(instructionListToken, tokenValueMap) {
	if (instructionListToken.type === ParseTreeTokenType.TREE_ROOT ||
	instructionListToken.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
		return {
			'min': 1,
			'max': 1
		};
	else if (instructionListToken.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const commandToken = instructionListToken.parentNode;
		const info = Command.getCommandInfo(commandToken.val);
		if (info === undefined)
			throw new Error('Instruction lists can not be the child of procedure calls');
		if (info.primaryName === 'if' || info.primaryName === 'ifelse') {
			let conditionValue = tokenValueMap.get(commandToken.children[0]);
			if (conditionValue === undefined) {
				return {
					'min': 0,
					'max': 1
				};
			}
			else {
				conditionValue = Boolean(conditionValue);
				const isFirstChild = commandToken.children.indexOf(instructionListToken) === 1;
				const count = conditionValue ? 1 : 0;
				if (isFirstChild)
					return {'min': count, 'max': count};
				else
					return {'min': 1 - count, 'max': 1 - count};
			}
		}
	}
};