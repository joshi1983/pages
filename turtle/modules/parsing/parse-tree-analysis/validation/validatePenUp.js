import { affectedPrimaryNames, getRecommendedRemovals } from './pen-up/getRecommendedRemovals.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validatePenUp(cachedParseTree, parseLogger) {
	const result = getRecommendedRemovals(getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP));
	result.tokens.forEach(function(token) {
		let msg = `Consider removing the call to ${token.val}. `;
		if (result.isOnlyPenDown === true)
			msg = `${msg}Since penUp is never called in the program, ${token.val} does nothing useful.`;
		else
			msg = `${msg}It does nothing in this context. No affected command is called between this ${token.val} and `+
		'the pen status is updated again.  All the commands affected by the pen being up/down are: '+
		affectedPrimaryNames.map(name => `<span class="command">${name}</span>`).join(', ')
		parseLogger.warn(msg, token, true);
	});
};