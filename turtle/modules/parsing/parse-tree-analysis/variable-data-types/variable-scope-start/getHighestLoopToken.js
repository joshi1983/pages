import { isRepeatingLoop } from './isRepeatingLoop.js';

export function getHighestLoopToken(token) {
	if (token.parentNode === null) {
		if (isRepeatingLoop(token))
			return token;
	}
	else {
		const higher = getHighestLoopToken(token.parentNode);
		if (higher !== undefined)
			return higher;
		else if (isRepeatingLoop(token))
			return token;
	}
};