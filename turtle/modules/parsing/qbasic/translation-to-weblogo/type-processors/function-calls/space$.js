import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { processToken } from
'../processToken.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

export function getToName(token) {
	const val = evaluateToken(token);
	if (val === undefined)
		return 'qbSpace';
};

export function space$(token, result, options) {
	const val = evaluateToken(token);
	if (val !== undefined) {
		result.append(` ${valueToLiteralCode(val)} `);
		return;
	}
	const name = getToName(token);
	const argList = token.children[1];
	const ch = argList.children;
	result.append(` ${name} `);
	processToken(argList, result, options);
};