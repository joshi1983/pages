import { DataTypes } from
'../../../data-types/DataTypes.js';
import { Operators } from
'../../../Operators.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
await DataTypes.asyncInit();
await Operators.asyncInit();

export function intersectRequiredTypesForUnaryOperatorToken(token, varName, requiredTypes) {
	const info = Operators.getOperatorInfo(token.val);
	if (info !== undefined) {
		const children = token.children;
		if (children.length !== 1)
			return;
		const child = children[0];
		if (child.type !== ParseTreeTokenType.VARIABLE_READ || child.val.toLowerCase() !== varName)
			return;
		requiredTypes.intersectWith(new DataTypes(info.unary.arg));
	}
};