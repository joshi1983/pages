import { isPossibleData } from
'./isPossibleData.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
import { MigrationInfo } from
'../MigrationInfo.js';
import { Operators } from
'../Operators.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.CHARACTER_LITERAL,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL
]);
const oneChildTypes = new Set([
	ParseTreeTokenType.ABSTRACT,
	ParseTreeTokenType.LAZY,
	ParseTreeTokenType.NEW,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.YIELD
]);
const twoChildTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FUNC_CALL,
	ParseTreeTokenType.WHILE
]);
const threeChildTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY
]);

function isCompleteAnnotationWithNext(prev, next) {
	const children = prev.children;
	if (children.length >= 1)
		return true;
	return next.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET;
}

function isAssignmentOperatorComplete(token) {
	const children = token.children;
	if (children.length >= 2)
		return true;

	const info = Operators.getOperatorInfo(token.val);
	if (info.isNotBinary) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.IDENTIFIER)
			return true;
		return children.length === 1;
	}

	return false;
}

function isCompleteCaseWithNext(prev, next) {
	const badNext = new Set([
		ParseTreeTokenType.CURLY_RIGHT_BRACKET,
		ParseTreeTokenType.CURVY_RIGHT_BRACKET
	]);
	if (badNext.has(next.type))
		return true;
	return false;
}

function isCompleteCodeBlock(token) {
	const children = token.children;
	const first = children[0];
	const last = children[children.length - 1];
	if (first !== undefined) {
		if (first.type === ParseTreeTokenType.CURLY_LEFT_BRACKET)
			return last.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
	}
	return false;
}

function isCompleteDefWithNext(token, next) {
	const parent = token.parentNode;
	const children = token.children;
	if (children.length === 0)
		return false;
	const badNextTypes = new Set([
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.DEF,
		ParseTreeTokenType.ELSE,
		ParseTreeTokenType.FOR,
		ParseTreeTokenType.IF,
		ParseTreeTokenType.MATCH,
		ParseTreeTokenType.OBJECT,
		ParseTreeTokenType.WHILE
	]);
	if (badNextTypes.has(next.type))
		return true;

	const firstChild = children[0];
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
		if (children.length < 2)
			return false;
	}
	else {
		if (next.type === ParseTreeTokenType.IDENTIFIER)
			return true;
	}
	const lastChild = children[children.length - 1];
	if (parent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		if (next.lineIndex !== lastChild.lineIndex)
			return true;
	}
	if (lastChild.type === ParseTreeTokenType.CODE_BLOCK) {
		if (next.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return false;
		return true;
	}
	if (next.type === ParseTreeTokenType.CURLY_LEFT_BRACKET &&
	(parent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)) {
		return true;
	}
	return false;
}

function isElseCompleteWithNext(prev, next) {
	const badNextTypes = new Set([
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.COMMA,
		ParseTreeTokenType.CURLY_RIGHT_BRACKET,
		ParseTreeTokenType.CURVED_RIGHT_BRACKET,
		ParseTreeTokenType.DEF,
		ParseTreeTokenType.ELSE,
		ParseTreeTokenType.FOR,
		ParseTreeTokenType.IMPORT,
		ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.OBJECT,
		ParseTreeTokenType.SEMICOLON,
		ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
		ParseTreeTokenType.VAL,
		ParseTreeTokenType.VAR
	]);
	if (badNextTypes.has(next.type))
		return true;
	if (prev.children.length === 0)
		return false;

	return next.type === ParseTreeTokenType.IDENTIFIER;
}


function isCompleteFatArrowWithNext(prev, next) {
	const badNext = new Set([
		ParseTreeTokenType.CURLY_RIGHT_BRACKET,
		ParseTreeTokenType.CURVED_RIGHT_BRACKET,
		ParseTreeTokenType.SQUARE_RIGHT_BRACKET
	]);
	if (badNext.has(next.type))
		return true;
	return false;
}

function isIdentifierCompleteWithNext(prev, next) {
	const badNextTypes = new Set([
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.COMMA,
		ParseTreeTokenType.CURLY_LEFT_BRACKET,
		ParseTreeTokenType.CURLY_RIGHT_BRACKET,
		ParseTreeTokenType.CURVED_RIGHT_BRACKET,
		ParseTreeTokenType.DEF,
		ParseTreeTokenType.ELSE,
		ParseTreeTokenType.FOR,
		ParseTreeTokenType.IF,
		ParseTreeTokenType.IMPORT,
		ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.OBJECT,
		ParseTreeTokenType.SEMICOLON,
		ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
		ParseTreeTokenType.VAL,
		ParseTreeTokenType.VAR,
		ParseTreeTokenType.WHILE
	]);
	if (badNextTypes.has(next.type))
		return MaybeDecided.Yes;
	const prevParent = prev.parentNode;
	if (next.type === ParseTreeTokenType.IDENTIFIER) {
		if (prevParent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION ||
		next.lineIndex !== prev.lineIndex) {
			return MaybeDecided.Yes;
		}
	}
	else if (next.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		if (prevParent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return MaybeDecided.Yes;
	}
	const children = prev.children;
	if (prevParent.type === ParseTreeTokenType.GOTO)
		return MaybeDecided.Yes;
	if (next.type === ParseTreeTokenType.BINARY_OPERATOR && prevParent.type === ParseTreeTokenType.UNARY_OPERATOR)
		return MaybeDecided.Yes;
	else if (next.type === ParseTreeTokenType.CURLY_LEFT_BRACKET) {
		if (prevParent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return MaybeDecided.Yes;
		if (prevParent.type === ParseTreeTokenType.DEF &&
		prevParent.parentNode !== null &&
		prevParent.parentNode.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
			return MaybeDecided.Yes;
		}
	}
	else if (next.type === ParseTreeTokenType.RETURN)
		return MaybeDecided.Yes;
	
	if (children.length >= 2)
		return MaybeDecided.Yes;
	return MaybeDecided.Maybe;
}

function isImportComplete(token) {
	const children = token.children;
	if (children.length === 0)
		return false;
	
	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.STRING_LITERAL ||
	lastChild.type === ParseTreeTokenType.IMPORT_PACKAGE_LIST)
		return true;
	return false;
}

function isLastChildType(type) {
	return function(token) {
		if (typeof token !== 'object')
			throw new Error(`token must be an object and more specifically a ParseTreeToken but found ${token}`);

		const children = token.children;
		if (children.length === 0)
			return false;

		const lastChild = children[children.length - 1];
		return lastChild.type === type;
	};
}

function isReturnComplete(token) {
	return token.children.length >= 1;
}

function isVarCompleteWithNext(prev, next) {
	if (next.type === ParseTreeTokenType.DEF ||
	next.type === ParseTreeTokenType.FOR ||
	next.type === ParseTreeTokenType.IF ||
	next.type === ParseTreeTokenType.MATCH ||
	next.type === ParseTreeTokenType.RETURN ||
	next.type === ParseTreeTokenType.VAL ||
	next.type === ParseTreeTokenType.VAR)
			return true;
	if (next.lineIndex !== prev.lineIndex)
		return true;
	return false;
}

const completeCheckers = new Map([
	[ParseTreeTokenType.ARG_LIST, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.ARRAY_LITERAL, isLastChildType(ParseTreeTokenType.ARRAY_VALUES_BLOCK)],
	[ParseTreeTokenType.ARRAY_VALUES_BLOCK, isLastChildType(ParseTreeTokenType.CURLY_RIGHT_BRACKET)],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, isAssignmentOperatorComplete],
	[ParseTreeTokenType.CODE_BLOCK, isCompleteCodeBlock],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.FOR, isLastChildType(ParseTreeTokenType.CODE_BLOCK)],
	[ParseTreeTokenType.FOR_LOOP_SETTINGS, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.IMPORT, isImportComplete],
	[ParseTreeTokenType.RETURN, isReturnComplete],
	[ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION, isLastChildType(ParseTreeTokenType.SQUARE_RIGHT_BRACKET)],
	[ParseTreeTokenType.TUPLE_LITERAL, isLastChildType(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
]);

export function isComplete(token) {
	if (typeof token !== 'object')
		throw new Error(`token must be a ParseTreeToken but it is not even an object.  token=${token}`);

	if (noChildTypes.has(token.type))
		return MaybeDecided.Yes;
	const children = token.children;
	if (oneChildTypes.has(token.type)) {
		if (children.length >= 1)
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}
	if (twoChildTypes.has(token.type)) {
		if (children.length >= 2)
			return MaybeDecided.Yes;
		else
			return MaybeDecided.No;
	}
	if (threeChildTypes.has(token.type)) {
		if (children.length < 3)
			return MaybeDecided.No;
	}

	const checker = completeCheckers.get(token.type);
	if (checker !== undefined) {
		return checker(token) ? MaybeDecided.Yes : MaybeDecided.No;
	}

	return MaybeDecided.Maybe;
};

export function isCompleteWithNext(prev, next) {
	if (typeof prev !== 'object' || prev === null)
		throw new Error(`prev must be an object but found ${prev}`);
	if (typeof next !== 'object' || next === null)
		throw new Error(`next must be an object but found ${next}`);

	const children = prev.children;
	const first = children[0];
	const last = children[children.length - 1];
	const prevParent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.ANNOTATION)
		return isCompleteAnnotationWithNext(prev, next);
	else if (prev.type === ParseTreeTokenType.ARRAY_LITERAL) {
		if (next.type === ParseTreeTokenType.FOR ||
		next.type === ParseTreeTokenType.VAL ||
		next.type === ParseTreeTokenType.VAR) {
			return true;
		}
	}
	else if (prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		if (children.length === 2 && next.type === ParseTreeTokenType.BINARY_OPERATOR)
			return false;
		if (next.type === ParseTreeTokenType.RETURN ||
		next.type === ParseTreeTokenType.CURLY_LEFT_BRACKET)
			return true;
	}
	else if (prev.type === ParseTreeTokenType.CASE) {
		return isCompleteCaseWithNext(prev, next);
	}
	else if (prev.type === ParseTreeTokenType.CODE_BLOCK) {
		if (next.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			return true;
		if (first !== undefined && first.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
		first.type !== ParseTreeTokenType.COLON)
			return true;
	}
	else if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		if (next.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
		next.type === ParseTreeTokenType.CURLY_LEFT_BRACKET ||
		next.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET ||
		next.type === ParseTreeTokenType.FOR ||
		next.type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET ||
		next.type === ParseTreeTokenType.VAR) {
			return true;
		}
		if (children.length >= 1) {
			if (last.lineIndex !== next.lineIndex)
				return true;
		}
	}
	else if (prev.type === ParseTreeTokenType.DEF) {
		return isCompleteDefWithNext(prev, next);
	}
	else if (prev.type === ParseTreeTokenType.ELSE) {
		return isElseCompleteWithNext(prev, next);
	}
	else if (prev.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		if (prev.children.length === 3) {
			if (next.type === ParseTreeTokenType.CLASS ||
			next.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET ||
			next.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET ||
			next.type === ParseTreeTokenType.DEF ||
			next.type === ParseTreeTokenType.FOR ||
			next.type === ParseTreeTokenType.IF ||
			next.type === ParseTreeTokenType.IMPORT ||
			next.type === ParseTreeTokenType.MATCH ||
			next.type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET ||
			next.type === ParseTreeTokenType.VAL ||
			next.type === ParseTreeTokenType.VAR ||
			next.type === ParseTreeTokenType.WHILE) {
				return true;
			}
			if (next.type === ParseTreeTokenType.IDENTIFIER)
				return true;
		}
	}
	else if (prev.type === ParseTreeTokenType.FAT_ARROW) {
		return isCompleteFatArrowWithNext(prev, next);
	}
	else if (prev.type === ParseTreeTokenType.FUNC_CALL) {
		if (children.length === 2) {
			if (next.type === ParseTreeTokenType.CURLY_LEFT_BRACKET) {
				const info = MigrationInfo.getFunctionInfo(prev);
				if (info !== undefined && info.expectsCodeBlock)
					return false;
			}
			if (next.type === ParseTreeTokenType.DOT)
				return false;
		}
	}
	else if (prev.type === ParseTreeTokenType.IDENTIFIER) {
		const maybeResult = isIdentifierCompleteWithNext(prev, next);
		if (maybeResult === MaybeDecided.Yes)
			return true;
		else
			return false;
	}
	else if (prev.type === ParseTreeTokenType.IF) {
		if (children.length >= 2) {
			if (next.type !== ParseTreeTokenType.ELSE)
				return true;
		}
		if (prevParent.type === ParseTreeTokenType.ELSE_IF &&
		next.type === ParseTreeTokenType.ELSE)
			return true;
		if (next.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET ||
		next.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET ||
		next.type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
			return true;
		if (last !== undefined) {
			if (last.type === ParseTreeTokenType.CODE_BLOCK &&
			next.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET &&
			next.type !== ParseTreeTokenType.ELSE)
				return true;
		}
	}
	else if (prev.type === ParseTreeTokenType.IMPORT) {
		if (next.type === ParseTreeTokenType.CLASS ||
		next.type === ParseTreeTokenType.DEF ||
		next.type === ParseTreeTokenType.IMPORT ||
		next.type === ParseTreeTokenType.VAL ||
		next.type === ParseTreeTokenType.VAR ||
		next.type === ParseTreeTokenType.WHILE)
			return true;
		if (next.lineIndex !== prev.lineIndex) {
			return true;
		}
		return false;
	}
	else if (prev.type === ParseTreeTokenType.TUPLE_LITERAL) {
		if (next.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
			return false;
	}
	else if (prev.type === ParseTreeTokenType.VAL) {
		return isVarCompleteWithNext(prev, next);
	}
	else if (prev.type === ParseTreeTokenType.VAR) {
		return isVarCompleteWithNext(prev, next);
	}
	if (next.type === ParseTreeTokenType.BINARY_OPERATOR ||
	next.type === ParseTreeTokenType.RANGE_OPERATOR) {
		if (next.val === '*' && last !== undefined && last.type === ParseTreeTokenType.ARG_LIST)
			return false;
		if (prevParent !== null) {
			if (isPossibleData(prev) && prevParent.type === ParseTreeTokenType.RETURN)
				return false;
			if (isComplete(prevParent) === MaybeDecided.No)
				return false;
		}
	}
	if (isComplete(prev) === MaybeDecided.Yes)
		return true;

	return false;
};