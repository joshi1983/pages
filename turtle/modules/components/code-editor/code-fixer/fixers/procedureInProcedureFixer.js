import { Command } from '../../../../parsing/Command.js';
import { getProcedureFromAnyTokenInProcedure } from '../../../../parsing/parse-tree-analysis/variable-data-types/getProcedureFromAnyTokenInProcedure.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { tokenToProcedure } from '../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
await Command.asyncInit();
const toNames = Command.getLowerCaseCommandNameSet('to');

export function procedureInProcedureFixer(cachedParseTree, fixLogger) {
	const toInProcedures = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(tok => tok.parentNode !== null &&
			tok.parentNode.parentNode !== null &&
			tok.parentNode.type === ParseTreeTokenType.LIST &&
			tok.parentNode.parentNode.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD &&
			toNames.has(tok.val.toLowerCase()));
	toInProcedures.forEach(function(toToken) {
		const endToken = new ParseTreeToken('end', null, toToken.lineIndex, toToken.colIndex - 1, ParseTreeTokenType.PROCEDURE_END_KEYWORD);
		const proc = getProcedureFromAnyTokenInProcedure(toToken);
		const procStartToken = proc.getStartToken();
		const procEndToken = proc.getEndToken();
		if (procEndToken.type !== ParseTreeTokenType.PROCEDURE_END_KEYWORD)
			return;
		procStartToken.removeChild(procEndToken);
		procStartToken.appendChild(endToken);
		toToken.appendChild(procEndToken);
		toToken.type = ParseTreeTokenType.PROCEDURE_START_KEYWORD;
		cachedParseTree.tokenTypeChanged(toToken, ParseTreeTokenType.PARAMETERIZED_GROUP);
		cachedParseTree.tokenAdded(endToken);
		cachedParseTree.procedureAdded(tokenToProcedure(toToken));
		fixLogger.log('Added "end" before "to" to mark the end of the previous procedure.  A procedure can not be defined in another procedure.', endToken);
	});
};