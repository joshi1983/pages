import { callTokenToArgValueTokens } from '../helpers/callTokenToArgValueTokens.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

export function getToName(token) {
	const args = callTokenToArgValueTokens(token);
	if (args.length === 2) {
		const first = args[0];
		if (first.type === ParseTreeTokenType.IDENTIFIER) {
			const val = first.val.toLowerCase();
			if (val === '_byte')
				return 'char';
			else if (val === '_integer64')
				return 'makeInteger64String';
			else if (val === 'long')
				return 'makeLongString';
		}
	}
	return 'makeIntegerString';
};

export function _mk$(token, result, options) {
	const args = callTokenToArgValueTokens(token);
	if (args.length === 2) {
		const name = getToName(token);
		result.append(` ${name} `);
		processToken(args[1], result, options);
	}
};