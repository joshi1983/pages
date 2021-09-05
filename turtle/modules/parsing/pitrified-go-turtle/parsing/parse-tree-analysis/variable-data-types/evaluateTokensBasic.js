import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { flatten } from
'../../../../generic-parsing-utilities/flatten.js';

export function evaluateTokensBasic(root) {
	const result = new Map();
	for (const token of flatten(root)) {
		const val = evaluateToken(token);
		if (val !== undefined)
			result.set(token, val);
	}
	return result;
};