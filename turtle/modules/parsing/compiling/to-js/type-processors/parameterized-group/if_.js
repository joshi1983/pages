import { filterBrackets } from
'../helpers/filterBrackets.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';

export function if_(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const conditionToken = children[0];
	const instructionsToken = children[1];
	result.append('\nif (');
	processToken(conditionToken, result, options);
	result.append(') {\n');
	processTokens(filterBrackets(instructionsToken.children), result, options);
	result.append('\n}\n');
};