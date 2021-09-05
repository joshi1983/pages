import { filterBrackets } from
'../helpers/filterBrackets.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';

export function until(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const conditionToken = children[0];
	const instructionsToken = children[1];
	result.append('\nwhile (true) {\n');
	result.append(') {\n');
	if (instructionsToken !== undefined) {
		processTokens(filterBrackets(instructionsToken.children), result, options);
	}
	result.append('\nif (');
	processToken(conditionToken, result, options);
	result.append(') {\nbreak;\n}\n');
	result.append('\n}\n');
};