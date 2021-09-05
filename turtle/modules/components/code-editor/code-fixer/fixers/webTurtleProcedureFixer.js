import { compareTokenLocations } from '../../../../parsing/parse-tree-token/compareTokenLocations.js';
import { getParseTokensSorted } from '../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { getTokenAfter } from './getTokenAfter.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { tokenToProcedure } from '../../../../parsing/parse-tree-analysis/tokenToProcedure.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';
await ParseTreeToken.asyncInit();

function getReturnTokens(cachedParseTree) {
	const returnTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(token => token.val.toLowerCase() === 'return');
	getParseTokensSorted(returnTokens);
	return returnTokens;
}

function isLikelyWebTurtle(numProcStarts, returnTokens) {
	return returnTokens.length >= numProcStarts;
}

/*
This is designed to help convert WebTurtle code into a format runnable in WebLogo.

WebTurtle can be found at:
http://www.sonic.net/~nbs/webturtle/webturtle.cgi
*/
export function webTurtleProcedureFixer(cachedParseTree, fixLogger) {
	const procStartTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(token => token.val === '#' &&
			token.nextSibling !== null &&
			token.nextSibling.type === ParseTreeTokenType.LEAF &&
			validateIdentifier(token.nextSibling.val) === undefined);
	if (procStartTokens.length !== 0) {
		const returnTokens = getReturnTokens(cachedParseTree);
		if (!isLikelyWebTurtle(procStartTokens.length, returnTokens))
			return;
		procStartTokens.forEach(function(procStartToken) {
			const nameToken = procStartToken.nextSibling;
			let endToken = getTokenAfter(returnTokens, procStartToken);
			let isEndAdded = false;
			let previousType, previousValue;
			let instructionListToken = new ParseTreeToken(null, null, 
				nameToken.lineIndex, nameToken.colIndex + 2, ParseTreeTokenType.LIST);
			if (endToken === undefined) {
				const lastToken = cachedParseTree.getLastToken();
				endToken = new ParseTreeToken('end', null, 
					lastToken.lineIndex, lastToken.colIndex + 1, ParseTreeTokenType.PROCEDURE_END_KEYWORD);
				isEndAdded = true;
			}
			if (endToken.parentNode !== null)
				endToken.remove();
			let firstN = nameToken.nextSibling;
			for (let n = firstN; n !== endToken && n !== null && 
			compareTokenLocations(n, endToken) <= 0;) {
				const oldN = n;
				n = n.nextSibling; 
				// move to next before appendChild because 
				// nextSibling will be mutated by appendChild.
				oldN.remove();
				instructionListToken.appendChild(oldN);
			}
			if (endToken.val.toLowerCase() !== 'end') {
				previousValue = endToken.val;
				endToken.val = 'end';
				cachedParseTree.tokenValueChanged(endToken, previousValue);
			}
			previousType = endToken.type;
			if (previousType !== ParseTreeTokenType.PROCEDURE_END_KEYWORD) {
				endToken.type = ParseTreeTokenType.PROCEDURE_END_KEYWORD;
				cachedParseTree.tokenTypeChanged(endToken, previousType);
			}
			const paramListToken = new ParseTreeToken(null, null, nameToken.lineIndex, 
				nameToken.colIndex + 1, ParseTreeTokenType.LIST);
			procStartToken.val = 'to';
			procStartToken.type = ParseTreeTokenType.PROCEDURE_START_KEYWORD;
			cachedParseTree.tokenTypeChanged(procStartToken, ParseTreeTokenType.LEAF);
			nameToken.remove();
			procStartToken.appendChild(nameToken);
			procStartToken.appendChild(paramListToken);
			cachedParseTree.tokensAdded([paramListToken, instructionListToken]);
			procStartToken.appendChild(instructionListToken);
			procStartToken.appendChild(endToken);
			if (isEndAdded)
				cachedParseTree.tokenAdded(endToken);
			const proc = tokenToProcedure(procStartToken);
			cachedParseTree.procedureAdded(proc);
			fixLogger.log(`Replaced # with 'to' because WebLogo uses 'to' to mark the beginning of a procedure`, procStartToken);
		});
	}
};