import { isDocumentToken } from './isDocumentToken.js';
import { isGetContextCall } from './isGetContextCall.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

export function shouldAssignmentBeRemoved(token) {
	if (token.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	const fromToken = token.children[1];
	if (fromToken !== undefined) {
		if (isDocumentToken(fromToken))
			return true;
		if (isGetContextCall(fromToken))
			return true;
	}
	return false;
};