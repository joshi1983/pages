import { Operators } from '../../../Operators.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.children.length === 0)
		return false;
	if (token.val === '<-')
		return true;
	const info = Operators.getOperatorInfo(token.val);
	return info.unary.returnTypes !== undefined;
}

export function getDataTypesFromUnaryOperators(tokens, result, settings) {
	if (tokens instanceof Set)
		tokens = Array.from(tokens);
	const operators = tokens.filter(t => t.type === ParseTreeTokenType.UNARY_OPERATOR && isOfInterest(t));
	for (const operator of operators) {
		const info = Operators.getOperatorInfo(operator.val);
		if (info.unary.returnTypes !== undefined)
			result.set(operator, info.unary.returnTypes);
		else {
			const child = operator.children[0];
			const childTypes = result.get(child);
			if (childTypes !== undefined) {
				if (operator.val === '<-') {
					if (childTypes.startsWith('chan '))
						result.set(operator, childTypes.substring('chan '.length));
				}
			}
		}
	}
};