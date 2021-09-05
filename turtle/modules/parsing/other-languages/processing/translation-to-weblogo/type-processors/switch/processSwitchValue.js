import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

export function processSwitchValue(switchToken, result, settings) {
	const expr = switchToken.children[0];

	if (expr.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	expr.children.length >= 2) {
		const wrappedToken = expr.children[1];
		if (wrappedToken.children.length === 0) {
			processToken(wrappedToken, result, settings);
			return;
		}
	}
	processToken(expr, result, settings);
};