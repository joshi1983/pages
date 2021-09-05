import { processToken } from './processToken.js';

export function processIf(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (token.children.length >= 2) {
		let translatedName = 'if';
		if (token.children.length > 3)
			translatedName = 'ifelse';
		result.trimRight();
		result.append('\n' + translatedName + ' ');
		processToken(token.children[0], result, settings);
		result.append(' [\n');
		processToken(token.children[1], result, settings);
		result.append('\n]');
		if (token.children.length > 3) {
			result.append(' [\n');
			processToken(token.children[2].children[0], result, settings);
			result.append('\n]');
		}
		result.append('\n');
	}
	else {
		result.append('; Translation failed for if-statement\n');
		result.append('; because the input if-statement appears to be incomplete\n');
	}
};