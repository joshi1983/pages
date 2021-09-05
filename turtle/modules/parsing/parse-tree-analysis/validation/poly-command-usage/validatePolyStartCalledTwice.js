import { CommandCalls } from '../../CommandCalls.js';
import { getSortedTokenIndex } from '../../cached-parse-tree/getSortedTokenIndex.js';
import { getSortedTokens } from '../../cached-parse-tree/getSortedTokens.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { startsWithPolyStart } from './startsWithPolyStart.js';

export function validatePolyStartCalledTwice(polyStartCalls, cachedParseTree, parseLogger) {
	const tokens = getSortedTokens(cachedParseTree);
	const tokenTypes = new Set([
		ParseTreeTokenType.PROCEDURE_START_KEYWORD,
		ParseTreeTokenType.PROCEDURE_END_KEYWORD
	]);
	for (let i = 1; i < polyStartCalls.length; i++) {
		const prevCall = polyStartCalls[i - 1];
		const curCall = polyStartCalls[i];
		const curIndex = getSortedTokenIndex(cachedParseTree, curCall);
		const prevIndex = getSortedTokenIndex(cachedParseTree, prevCall);
		const tokensBetween = tokens.slice(prevIndex, curIndex).some(tok => 
		tokenTypes.has(tok.type) || (tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP && 
		(!CommandCalls.isCommandCall(tok) || CommandCalls.tokenMatchesPrimaryName(tok, 'polyEnd'))));
		if (!tokensBetween) {
			parseLogger.warn(`polyStart call has no effect.  You already called polyStart on line ${prevCall.lineIndex} and did not call polyEnd to end the previous polygon.`, curCall);
		}
		else {
			const nextToken = curCall.nextSibling;
			if (nextToken !== null && nextToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
				const proc = cachedParseTree.getProcedureByName(nextToken.val.toLowerCase());
				if (proc !== undefined && startsWithPolyStart(proc)) {
					parseLogger.warn(`polyStart is called at the start of procedure ${proc.name} so you're calling polyStart twice consecutively.  Consider removing this call to polyStart.`, curCall);
				}
			}
		}
	}
};