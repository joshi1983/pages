import { isCompleteValueToken } from '../../isCompleteValueToken.js';

export function validateNoTokensDefinitelyIncomplete(token, parseLogger) {
	const result = isCompleteValueToken(token);
	if (result === false) {
		parseLogger.error(`Expected ${ParseTreeTokenType.getNameFor(token)} to have .`, token);
	}
};