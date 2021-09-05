import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';

export function repeat(token, result, settings) {
	const args = filterBracketsAndCommas(token.children[1].children);
	const codeBlock = token.children[2];
	const countToken = args[0];
	result.append(`\nrepeat `);
	if (countToken === undefined)
		result.append('1');
	else
		processToken(countToken, result, settings);
	result.append(' [\n');
	if (codeBlock !== undefined)
		processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);
	result.append('\n]\n');
};