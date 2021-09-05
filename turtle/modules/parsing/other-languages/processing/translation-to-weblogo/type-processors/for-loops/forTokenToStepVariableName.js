import { forToStepToken } from './forToStepToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function forTokenToStepVariableName(forToken) {
	const stepToken = forToStepToken(forToken);
	if (stepToken === null)
		return;
	let t = stepToken;
	if (t.type === ParseTreeTokenType.UNARY_OPERATOR) {
		if (t.children.length === 1)
			t = t.children[0];
		else
			return;
	}
	if (t.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const identifiers = t.children.filter(tok => tok.type === ParseTreeTokenType.IDENTIFIER);
		if (identifiers.length >= 1)
			return identifiers[0].val;
		else
			return;
	}	
	if (t.type === ParseTreeTokenType.IDENTIFIER)
		return t.val;
};