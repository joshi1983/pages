import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { processToken } from
'../processToken.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

export function getToName(token) {
	const val = evaluateToken(token);
	if (val === undefined)
		return 'qbTab';
};

export function tab(token, result, options) {
	const val = evaluateToken(token);
	if (val !== undefined && val < 4) {
		// The < 4 is because the translated code will be clearer with 
		// a procedure than having a huge string literal.
		result.append(` ${valueToLiteralCode(val)} `);
		return;
	}
	const name = getToName(token);
	const argList = token.children[1];
	const ch = argList.children;
	result.append(` ${name} `);
	processToken(argList, result, options);
};