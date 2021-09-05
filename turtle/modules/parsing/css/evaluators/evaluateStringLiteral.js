import { evaluateStringLiteral as jsEvaluateStringLiteral } from '../../js-parsing/evaluateStringLiteral.js';

export function evaluateStringLiteral(token) {
	return jsEvaluateStringLiteral(token.val);
};