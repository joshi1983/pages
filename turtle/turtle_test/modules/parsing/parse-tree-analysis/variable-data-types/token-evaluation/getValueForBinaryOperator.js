import { BinaryOperatorInstruction } from '../../../execution/instructions/BinaryOperatorInstruction.js';
import { Operators } from '../../../Operators.js';
await Operators.asyncInit();

export function getValueForBinaryOperator(token, tokenValueMap) {
	if (token.children.length === 2) {
		const vals = [];
		for (let i = 0; i < 2; i++) {
			const val = tokenValueMap.get(token.children[i]);
			if (val === undefined)
				return;
			else
				vals.push(val);
		}
		return BinaryOperatorInstruction.evaluate(token.val, vals[0], vals[1]);
	}
};