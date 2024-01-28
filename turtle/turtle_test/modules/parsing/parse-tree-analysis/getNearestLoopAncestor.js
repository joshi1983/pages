import { isLoop } from './isLoop.js';

export function getNearestLoopAncestor(token) {
	token = token.parentNode;
	while (token !== null) {
		if (isLoop(token))
			return token;
		token = token.parentNode;
	}
};