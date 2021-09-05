import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { isComplete } from
'./parsing/isComplete.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { QBasicInternalFunctions } from './QBasicInternalFunctions.js';
import { QBasicOperators } from './QBasicOperators.js';

const unaryPrevTypes = new Set([
	ParseTreeTokenType.ELSEIF,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.TREE_ROOT
]);
const unaryLastTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.STEP
]);

const binaryPreviousOperandTokenTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
]);

function getClosestValueToken(token) {
	while (token !== null) {
		if (binaryPreviousOperandTokenTypes.has(token.type)) {
			if (isComplete(token))
				return token;
			return;
		}
		token = token.parentNode;
	}
}

export function shouldBecomeUnaryOperator(prev, next, functionsMap) {
	if (next.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	!QBasicOperators.mightBeUnary(next.val))
		return false;
	if (QBasicOperators.isOnlyUnary(next.val.toLowerCase()))
		return true;
	const prevParent = prev.parentNode;
	const prevPrev = prev.getPreviousSibling();
	if (prevPrev !== null &&
	prev.type === ParseTreeTokenType.ARG_LIST &&
	prev.children.length === 0 &&
	prevParent.type === ParseTreeTokenType.FUNCTION_CALL) {
		const functionInfo = QBasicInternalFunctions.getFunctionInfo(prevPrev.val.toLowerCase(), functionsMap);
		if (functionInfo !== undefined) {
			const count = functionInfo.argCount;
			if (count === undefined) {
				if (functionInfo.args !== undefined &&
				functionInfo.args.length > 0)
					return true;
			}
			else if (count.min !== undefined && count.min !== 0)
				return true;
		}
	}
	if (prev.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	prev.children.length === 1)
		return true;
	const lastToken = getSortedLastDescendentTokenOf(prev);
	if (unaryLastTypes.has(lastToken.type))
		return true;
	const lastParent = lastToken.parentNode;
	if (lastToken.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
		if (lastParent.type === ParseTreeTokenType.ARG_LIST) {
			return false;
		}
	}
	const valToken = getClosestValueToken(lastToken);
	if (valToken !== undefined)
		return false;

	return unaryPrevTypes.has(prev.type);
};