import { ArrayUtils } from '../../../ArrayUtils.js';
import { Command } from '../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../parsing/ParseTreeTokenType.js';
import { processTokensUsingBestCase } from './processTokensUsingBestCase.js';

export function harmonizeProcedureNameCase(parseTree) {
	const procCalls = parseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => Command.getCommandInfo(token.val) === undefined);
	const procNameTokens = parseTree.getTokensByType(ParseTreeTokenType.PROCEDURE_START_KEYWORD).
		filter(token => token.children.length > 0 && token.children[0].type === ParseTreeTokenType.LEAF).
		map(token => token.children[0]);
	const allTokens = [];
	ArrayUtils.pushAll(allTokens, procCalls);
	ArrayUtils.pushAll(allTokens, procNameTokens);
	processTokensUsingBestCase(allTokens);
};