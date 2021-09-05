import { filterBrackets } from
'../helpers/filterBrackets.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';

export function do_while(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const instructionsToken = children[0];
	const conditionToken = children[1];
	result.append('\ndo');
	result.append(') {\n');
	if (instructionsToken !== undefined) {
		processTokens(filterBrackets(instructionsToken.children), result);
	}
	result.append('\n} while (');
	processToken(conditionToken, result);
	result.append(');\n');
};