import { isPropertyReadToken, processPropertyRead } from './processPropertyRead.js';
import { processToken } from './processToken.js';

function usesPropertyToSkip(token) {
	if (!isPropertyReadToken(token))
		return false;
	const grandChild = token.children[0].children[0];
	return grandChild.children.length !== 0;
}

function shouldBeSkipped(token) {
	return usesPropertyToSkip(token);
}

export function processThis(token, result, settings) {
	if (shouldBeSkipped(token)) {
		if (token.children.length !== 0) {
			processToken(token.children[0], result, settings);
			return;
		}
	}
	if (isPropertyReadToken(token)) {
		processPropertyRead(token, result, settings);
	}
	else {
		result.append('this');
		for (const child of token.children)
			processToken(child, result, settings);
	}
};