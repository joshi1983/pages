import { DataTypes } from
'../../../data-types/DataTypes.js';
import { Operators } from
'../../../Operators.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
await DataTypes.asyncInit();
await Operators.asyncInit();

export function intersectRequiredTypesForBinaryOperatorToken(token, varName, requiredTypes) {
	const info = Operators.getOperatorInfo(token.val);
	if (info !== undefined) {
		const children = token.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.type !== ParseTreeTokenType.VARIABLE_READ)
				continue;
			if (child.val.toLowerCase() !== varName)
				continue;
			requiredTypes.intersectWith(new DataTypes(info.args[i]));
		}
	}
};