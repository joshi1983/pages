import { CommandCalls } from './CommandCalls.js';

export function getNearestRepeat(token) {
	do {
		token = token.parentNode;
		if (token !== null && CommandCalls.tokenMatchesPrimaryName(token, 'repeat'))
			return token;
	}
	while (token !== null);
};