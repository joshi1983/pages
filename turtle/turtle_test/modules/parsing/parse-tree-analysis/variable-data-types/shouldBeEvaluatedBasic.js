import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldBeEvaluatedAdvanced } from './shouldBeEvaluatedAdvanced.js';

export function shouldBeEvaluatedBasic(token) {
	if (!shouldBeEvaluatedAdvanced(token))
		return false;
	if (token.type === ParseTreeTokenType.VARIABLE_READ)
		return false;

	return true;
};