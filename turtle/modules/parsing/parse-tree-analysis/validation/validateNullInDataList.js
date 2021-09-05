import { Command } from '../../Command.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { isInstructionList } from '../isInstructionList.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

export function validateNullInDataList(cachedParseTree, parseLogger) {
	const dataListLiterals = getTokensByType(cachedParseTree, ParseTreeTokenType.LIST).filter(list => !isInstructionList(list));
	dataListLiterals.forEach(function(listToken) {
		const children = listToken.children;
		const lastBracketIndex = children.length - 1;
		for (let i = 1; i < lastBracketIndex; i++) {
			const token = children[i];
			if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
				const info = Command.getCommandInfo(token.val);
				if (info !== undefined && info.returnTypes === null)
					parseLogger.error(`A data list must have data in every element but the <span class="command">${info.primaryName} command</span> doesn't return anything.`, token, true);
			}
		}
	});
};