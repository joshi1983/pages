import { Command } from
'../../../../../../parsing/Command.js';
import { getDescendentsOfType } from
'../../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getLastDescendentTokenOf } from
'../../../../../../parsing/generic-parsing-utilities/getLastDescendentTokenOf.js';
import { getSortedFirstDescendentTokenOf } from
'../../../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';
import { pathBreakingCommands } from
'./simplifyWithPolygon.js';

function mightContainPathBreak(token, cachedParseTree) {
	const tokens = getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return tokens.some(function(tok) {
		const info = Command.getCommandInfo(tok.val);
		if (info !== undefined) {
			if (pathBreakingCommands.has(info.primaryName))
				return true;
			if (info.primaryName === 'penUp' || info.primaryName === 'penDown')
				return true;
		}
		else {
			// FIXME: should we return true here?
			// Unless we know the procedure doesn't call a path breaking command, token might break a path.
		}
		return false;
	});
}

function createList(position, cachedParseTree) {
	if (position.children !== undefined && position.children.length !== 0)
		position = getSortedFirstDescendentTokenOf(position);

	const colIndex = Math.max(0, position.colIndex - 1);
	const result = new ParseTreeToken(null, null,
		position.lineIndex, colIndex,
		ParseTreeTokenType.LIST);
	const openBracket = new ParseTreeToken('[', null,
		position.lineIndex, colIndex,
		ParseTreeTokenType.LEAF);
	result.appendChild(openBracket);
	cachedParseTree.tokensAdded([openBracket, result]);
	return result;
}

function createCloseBracket(ancestorToken, cachedParseTree) {
	if (!(ancestorToken.children instanceof Array))
		throw new Error(`ancestorToken must be a token and ancestorToken.children must be an Array but found ${ancestorToken}`);

	const position = getLastDescendentTokenOf(ancestorToken);
	const result = new ParseTreeToken(']', null,
		position.lineIndex, position.colIndex + 1,
		ParseTreeTokenType.LEAF);
	cachedParseTree.tokenAdded(result);
	return result;
}

function createZeroToken(ancestorToken, cachedParseTree) {
	const position = getLastDescendentTokenOf(ancestorToken);
	const result = new ParseTreeToken(0, null,
		position.lineIndex, position.colIndex + 1,
		ParseTreeTokenType.NUMBER_LITERAL, '0');
	cachedParseTree.tokenAdded(result);
	return result;
}

function mightCurvedBracketsBeNeeded(token) {
	if (token.children.length === 0 ||
	token.type === ParseTreeTokenType.PARAMETERIZED_GROUP ||
	token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	token.type === ParseTreeTokenType.LIST ||
	token.type === ParseTreeTokenType.UNARY_OPERATOR)
		return false;

	return true;
}

function negateToken(token, cachedParseTree) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		if (token.val !== 0) {
			// for example, convert 123 to -123.
			token.val = -token.val;
			token.originalString = '' + token.val;
		}
	}
	else if (token.val === '-' && token.type === ParseTreeTokenType.UNARY_OPERATOR) {
		// For example, convert -:x to :x.
		// - cancels out -.
		token.removeSingleToken();
		cachedParseTree.tokenRemoved(token);
	}
	else {
		const sortedFirst = token.children.length === 0 ? token : getSortedFirstDescendentTokenOf(token);
		const negativeOperator = new ParseTreeToken('-', null,
			sortedFirst.lineIndex, Math.max(0, sortedFirst.colIndex - 1),
			ParseTreeTokenType.UNARY_OPERATOR);
		const parent = token.parentNode;
		parent.replaceChild(token, negativeOperator);
		negativeOperator.appendChild(token);
		if (mightCurvedBracketsBeNeeded(token)) {
			// for example, convert - :x + :y to -(:x + :y)
			// The brackets are important to control order of operation in some cases.
			const openBracket = new ParseTreeToken('(', null,
				negativeOperator.lineIndex, negativeOperator.colIndex + 1,
				ParseTreeTokenType.LEAF);
			const lastPosition = getLastDescendentTokenOf(token);
			const closeBracket = new ParseTreeToken(')', null,
				lastPosition.lineIndex, lastPosition.colIndex + 1,
				ParseTreeTokenType.LEAF);
			const expression = new ParseTreeToken(null, null,
				openBracket.lineIndex, openBracket.colIndex,
				ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
			expression.appendChild(openBracket);
			token.remove();
			expression.appendChild(token);
			expression.appendChild(closeBracket);
			negativeOperator.appendChild(expression);
			cachedParseTree.tokensAdded([closeBracket, expression, openBracket]);
		}
		cachedParseTree.tokenAdded(negativeOperator);
	}
}

function arcLeft(token, cachedParseTree) {
	const children = token.children;
	const angleToken = children[0];
	const radiusToken = children[1];
	const list = createList(angleToken, cachedParseTree);
	const closeBracket = createCloseBracket(radiusToken, cachedParseTree);
	token.replaceChild(angleToken, list);
	angleToken.remove();
	radiusToken.remove();
	list.appendChild(angleToken);
	list.appendChild(radiusToken);
	list.appendChild(closeBracket);
}

function arcRight(token, cachedParseTree) {
	const children = token.children;
	const angleToken = children[0];
	const radiusToken = children[1];
	const list = createList(angleToken, cachedParseTree);
	token.replaceChild(angleToken, list);
	angleToken.remove();
	radiusToken.remove();
	list.appendChild(angleToken);
	list.appendChild(radiusToken);
	negateToken(angleToken, cachedParseTree);
	const closeBracket = createCloseBracket(radiusToken, cachedParseTree);
	list.appendChild(closeBracket);
}

function backward(token, cachedParseTree) {
	const child = token.children[0];
	const list = createList(child, cachedParseTree);
	token.replaceChild(child, list);
	child.remove();
	list.appendChild(child);
	negateToken(child, cachedParseTree);
	const closeBracket = createCloseBracket(child, cachedParseTree);
	list.appendChild(closeBracket);
}

function forward(token, cachedParseTree) {
	const child = token.children[0];
	const list = createList(child, cachedParseTree);
	const closeBracket = createCloseBracket(child, cachedParseTree);
	token.replaceChild(child, list);
	child.remove();
	list.appendChild(child);
	list.appendChild(closeBracket);
}

function right(token, cachedParseTree) {
	const angleToken = token.children[0];
	const list = createList(angleToken, cachedParseTree);
	token.replaceChild(angleToken, list);
	angleToken.remove();
	list.appendChild(angleToken);
	negateToken(angleToken, cachedParseTree);
	const angleParentToken = list.children[list.children.length - 1]; 
		// might be angleToken or its unary operator parent

	const zero = createZeroToken(angleParentToken, cachedParseTree);
	list.appendChild(zero);
	const closeBracket = createCloseBracket(zero, cachedParseTree);
	list.appendChild(closeBracket);
}

function left(token, cachedParseTree) {
	const angleToken = token.children[0];
	const list = createList(angleToken, cachedParseTree);
	token.replaceChild(angleToken, list);
	angleToken.remove();
	list.appendChild(angleToken);
	const zero = createZeroToken(angleToken, cachedParseTree);
	list.appendChild(zero);
	const closeBracket = createCloseBracket(zero, cachedParseTree);
	list.appendChild(closeBracket);
}

const funcs = [
	arcLeft, arcRight,
	backward, forward,
	left, right
];
const names = new Map();
for (const func of funcs) {
	names.set(func.name, func);
}

function isOfInterest(token) {
	const prev = token.previousSibling;
	if (prev !== null &&
	prev.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		// Check if prev is likely of interest too.
		// if prev is of interest, token should not be of interest.
		// We want to minimize the probability of fixes overlapping each other.
		const info = Command.getCommandInfo(prev.val);
		if (info !== undefined && names.has(info.primaryName))
			return false;
	}
	let tok = token;
	for (let i = 0; i < 3; i++) {
		if (tok === null)
			return false;

		if (tok.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
		tok.children.length === 0)
			return false;

		const info = Command.getCommandInfo(tok.val);
		if (info === undefined || !names.has(info.primaryName))
			return false;
		
		if (mightContainPathBreak(tok))
			return false;

		tok = tok.nextSibling;
	}
	return true;
}

export function simplifyWithArcLines(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	calls.forEach(function(call) {
		if (call.parentNode === null || call.children.length === 0)
			return; // previous iterations might have mutated the call token.
			// We don't want to process the call token if it is in a weird state
			// such as being removed from its tree or having no children.

		let info = Command.getCommandInfo(call.val);
		if (info === undefined)
			return;
		call.val = 'arcLines';

		const list = createList(call.children[0], cachedParseTree);
		let tok = call, lastToken;
		while (tok !== null) {
			if (info === undefined)
				break;
			const next = tok.nextSibling;
			const processor = names.get(info.primaryName);
			if (processor === undefined ||
			tok.children.length === 0)
				break;

			processor(tok, cachedParseTree);
			if (tok !== call) {
				tok.remove();
				list.appendChild(tok);
				tok.removeSingleToken();
				cachedParseTree.tokenRemoved(tok);
			}
			else {
				while (tok.children.length !== 0) {
					const firstChild = tok.children[0];
					firstChild.remove();
					list.appendChild(firstChild);
				}
			}
			if (next === null ||
			next.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
				break;
			info = Command.getCommandInfo(next.val);
			tok = next;
		}
		lastToken = list.children[list.children.length - 1];
		const closeBracket = createCloseBracket(lastToken, cachedParseTree);
		const oneToken = new ParseTreeToken(1, null,
			closeBracket.lineIndex, closeBracket.colIndex + 1,
			ParseTreeTokenType.NUMBER_LITERAL, '1');
		list.appendChild(closeBracket);
		call.appendChild(list);
		call.appendChild(oneToken);
		cachedParseTree.tokenAdded(oneToken);
		fixLogger.log(`Converted a sequence of commands to arcLines to shorten the code`, call);
	});
};