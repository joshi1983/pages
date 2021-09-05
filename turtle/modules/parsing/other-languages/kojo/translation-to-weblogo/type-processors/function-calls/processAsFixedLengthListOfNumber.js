import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';

export function processAsFixedLengthListOfNumber(len, token, result, settings) {
	const argList = token.children[1];
	if (argList === undefined || argList.type !== ParseTreeTokenType.ARG_LIST) {
		result.append(` [${'0 '.repeat(len)}] `);
		return;
	}
	const children = filterBracketsAndCommas(argList.children);
	result.append(' [ ');
	for (let i = 0; i < len; i++) {
		const child = children[i];
		if (child === undefined)
			result.append(' 0 ');
		else
			processToken(child, result, settings);
	}
	result.append(' ] ');
};