import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function alreadyTippedForLeafCluster(token, parseLogger) {
	/*
	We start with the previous sibling because we still want to log 1 error for each unrecognized command/procedure.
	We want 1 error to tell the user that the problem is serious enough to prevent any execution.
	*/
	for (let t = token.previousSibling; t !== null && t.type === ParseTreeTokenType.LEAF; t = t.previousSibling) {
		if (parseLogger.hasTippedForToken(t))
			return true;
	}
	return false;
};