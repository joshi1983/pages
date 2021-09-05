import { processToken } from '../processToken.js';

export function _pi(token, result, options) {
	const args = token.children[1].children;
	if (args.length <= 2) {
		result.append(' pi ');
	}
	else {
		result.append('(pi * (');
		processToken(args[1], result, options);
		result.append('))');
	}
};