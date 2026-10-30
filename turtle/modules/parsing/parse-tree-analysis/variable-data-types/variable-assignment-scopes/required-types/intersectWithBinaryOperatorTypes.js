import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { Operators } from
'../../../../Operators.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function intersectWithBinaryOperatorTypes(operatorToken,
variableName, tokenToTypes, result, cachedParseTree) {
	const children = operatorToken.children;
	const operatorInfo = Operators.getOperatorInfo(operatorToken.val);
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.VARIABLE_READ ||
		child.val.toLowerCase() !== variableName)
			continue;
		const operandTypes = Operators.getParameterTypes(operatorInfo, i);
		result.intersectWith(new DataTypes(operandTypes));
	}
};