import { getClosestOfType } from '../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function shouldUseLocalmake(token) {
	const varNameToken = token.children[0];
	const learnToken = getClosestOfType(token, ParseTreeTokenType.LEARN);
	if (learnToken === null)
		return false;
	if (learnToken.children.length > 1) {
		const paramsParent = learnToken.children[1];
		if (paramsParent.type === ParseTreeTokenType.PARAMETERS_PARENT) {
			const children = paramsParent.children;
			if (children.some(c => c.type === ParseTreeTokenType.VARIABLE_REFERENCE &&
				c.val === varNameToken.val))
				return true;
		}
	}
	return false;
}

export function processAssignmentOperator(token, result) {
	if (token.children.length === 0 ||
	token.children[0].type !== ParseTreeTokenType.VARIABLE_REFERENCE)
		return; // the parse tree is too messed up to translate anything.
	const varToken = token.children[0];
	if (shouldUseLocalmake(token))
		result.append('local');
	result.append(`make "${varToken.val.substring(1)} `);
	if (token.children.length === 1) {
		result.append('0'); // just to recover from this erroneous situation.
		// Anyone reviewing the translation should find this and fix but it is 
		// better to force it into a valid state like this for now.
	}
	else
		processToken(token.children[1], result);
};