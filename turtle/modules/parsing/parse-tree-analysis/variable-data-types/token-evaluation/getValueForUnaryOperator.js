import { Operators } from '../../../Operators.js';
import { UnaryOperatorInstruction } from '../../../execution/instructions/UnaryOperatorInstruction.js';

await Operators.asyncInit();

export function getValueForUnaryOperator(token, tokenValueMap) {
	if (token.children.length === 1) {
		const val = tokenValueMap.get(token.children[0]);
		if (val !== undefined)
			return UnaryOperatorInstruction.evaluate(token.val, val);
	}
};