import { evaluateToken } from './evaluateToken.js';
import { filterParameterValueTokens } from './functions/filterParameterValueTokens.js';
import { functions } from './functions/functions.js';
import { needsSpecialEvaluation, evaluateSpecial } from
'./functions/specialFunctions.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function evaluateFunctionCall(token) {
	const firstChild = token.children[0];
	if (firstChild === undefined ||
	firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	const name = firstChild.val;
	const func = functions.get(name);
	if (func !== undefined) {
		const argList = token.children[1];
		const children = filterParameterValueTokens(argList.children);
		if (needsSpecialEvaluation(name, children))
			return evaluateSpecial(name, children);
		const vals = children.map(evaluateToken);
		if (vals.some(v => v === undefined))
			return;
		return func(...vals);
	}
};