import { CommandCalls } from '../../CommandCalls.js';

function isInIfOrIfElse(token) {
	while (token !== null) {
		if (CommandCalls.tokenMatchesPrimaryNames(token, ['if', 'ifelse']))
			return true;
		token = token.parentNode;
	}
	return false;
}

export function isUnconditionallyExecutedBefore(tokenInQuestion, laterToken) {
	// if in same instruction list
	if (laterToken.parentNode === tokenInQuestion.parentNode)
		return true;

	if (isInIfOrIfElse(tokenInQuestion)) {
		return false;
	}
	return true;
};