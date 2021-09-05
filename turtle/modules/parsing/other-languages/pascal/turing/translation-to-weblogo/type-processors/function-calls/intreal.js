import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';

export function intreal(token, result) {
	const argList = token.children[1];
	if (argList !== undefined &&
	argList.type === ParseTreeTokenType.ARG_LIST) {
		const parameters = filterBracketsAndCommas(argList.children);
		if (parameters.length !== 0)
			processToken(parameters[0], result);
	}
};