import { Operators } from
'../../../../Operators.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function intersectWithUnaryOperatorTypes(operatorToken, variableName,
tokenToTypes, result, cachedParseTree) {
	const child = operatorToken.children[0];
	if (child.type === ParseTreeTokenType.VARIABLE_READ &&
	child.val.toLowerCase() === variableName) {
		const operatorInfo = Operators.getOperatorInfo(operatorToken.val);
		result.intersectWith(new DataTypes(operatorInfo.unary.arg));
	}
};