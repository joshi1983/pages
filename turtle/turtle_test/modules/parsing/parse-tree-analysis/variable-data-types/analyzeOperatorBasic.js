import { Operators } from '../../Operators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processRequiredTypes } from './processRequiredTypes.js';

export function analyzeOperatorBasic(token, cachedParseTree, variables, containingProc) {
	const info = Operators.getOperatorInfo(token.val);
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		for (let i = 0; i < token.children.length; i++) {
			const types = Operators.getParameterTypes(info, i);
			processRequiredTypes(token.children[i], types, variables, containingProc);
		}
	}
	else if (token.children.length === 1) {
		const types = Operators.getUnaryParameterTypes(info);
		processRequiredTypes(token.children[0], types, variables, containingProc);
	}
};