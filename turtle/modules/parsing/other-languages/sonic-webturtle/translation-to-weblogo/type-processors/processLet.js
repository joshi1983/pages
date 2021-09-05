import { processToken } from './processToken.js';

export function processLet(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (token.children.length !== 0) {
		let varName = token.children[0].val;
		if (settings.variableNamesMap.has(varName.toLowerCase()))
			varName = settings.variableNamesMap.get(varName.toLowerCase());
		result.append(`\nmake "${varName} `);
	}
	if (token.children.length === 2) {
		processToken(token.children[1], result, settings);
	}
	else if (token.children.length === 1) {
		result.append('0');
	}
	result.append('\n');
};