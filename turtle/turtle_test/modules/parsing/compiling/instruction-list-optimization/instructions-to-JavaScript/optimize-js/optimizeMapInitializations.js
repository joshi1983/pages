import { flatten } from
'../../../../generic-parsing-utilities/flatten.js';
import { insertLineIndexSpanAt } from
'../../../../generic-parsing-utilities/insertLineIndexSpanAt.js';
import { isSetPropertyCallOnIdentifier } from
'./token-classifiers/isSetPropertyCallOnIdentifier.js';
import { parse } from
'../../../../js-parsing/parse.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { parseTreeTokensToCode } from
'../../../../js-parsing/parseTreeTokensToCode.js';
import { setLineIndexForAllDescendents } from
'./setLineIndexForAllDescendents.js';

function isOfInterest(token) {
	if (token.val !== '=' || token.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR || token.children.length !== 2)
		return false;
	const child = token.children[0];
	if (child.children.length !== 0 || child.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const rightSideOperand = token.children[1];
	if (rightSideOperand.type !== ParseTreeTokenType.NEW)
		return false;
	const newChild = rightSideOperand.children[0];
	if (newChild.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const argList = newChild.children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST || argList.children.length !== 2)
		return false;
	const newGrandChild = newChild.children[0];
	if (newGrandChild.val !== 'Map' || newGrandChild.children.length !== 0)
		return false;
	const tokenParent = token.parentNode;
	const children = tokenParent.children;
	for (let i = children.indexOf(token) + 1; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			return isSetPropertyCallOnIdentifier(child);
		}
	}
	return false;
}

function moveIntoMapConstructor(mapAssignToken) {
	const children = mapAssignToken.parentNode.children;
	const initialTokenPairs = [];
	for (let i = children.indexOf(mapAssignToken) + 1; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (isSetPropertyCallOnIdentifier(child)) {
				const argList = child.children[1];
				initialTokenPairs.push([argList.children[3], argList.children[5]]);
				child.remove();
			}
			else
				break;
		}
		else {
			child.remove();
		}
		i--;
	}
	const mapFuncCall = mapAssignToken.children[1].children[0];
	const mapArgList = mapFuncCall.children[1];
	const endBracket = mapArgList.children[mapArgList.children.length - 1];
	insertLineIndexSpanAt(endBracket, 1);
	const newSquareLeftBracket = new ParseTreeToken('[', endBracket.lineIndex, endBracket.colIndex, ParseTreeTokenType.SQUARE_LEFT_BRACKET);
	const newArrayLiteral = new ParseTreeToken(null, endBracket.lineIndex, 0, ParseTreeTokenType.ARRAY_LITERAL);
	endBracket.lineIndex += initialTokenPairs.length + 1;
	const newSquareRightBracket = new ParseTreeToken(']', endBracket.lineIndex, 0, ParseTreeTokenType.SQUARE_RIGHT_BRACKET);
	endBracket.colIndex = 1;
	newArrayLiteral.appendChild(newSquareLeftBracket);
	initialTokenPairs.forEach(function(tokenPair, index) {
		const lineIndex = newSquareLeftBracket.lineIndex + index + 1;
		if (index !== 0) {
			const commaToken = new ParseTreeToken(',', lineIndex - 1, 100001, ParseTreeTokenType.COMMA);
			newArrayLiteral.appendChild(commaToken);
		}
		const argList = tokenPair[0].parentNode;
		const squareLeft = new ParseTreeToken('[', lineIndex, 0, ParseTreeTokenType.SQUARE_LEFT_BRACKET);
		const existingCommaToken = argList.children[4];
		const squareRight = new ParseTreeToken(']', lineIndex, 100000, ParseTreeTokenType.SQUARE_LEFT_BRACKET);
		const arrayLiteral = new ParseTreeToken(null, lineIndex, 0, ParseTreeTokenType.ARRAY_LITERAL);
		existingCommaToken.remove();
		arrayLiteral.appendChild(squareLeft);
		tokenPair[0].remove();
		arrayLiteral.appendChild(tokenPair[0]);
		setLineIndexForAllDescendents(tokenPair[0], lineIndex, 1);
		setLineIndexForAllDescendents(tokenPair[1], lineIndex, existingCommaToken.colIndex + 1);
		existingCommaToken.lineIndex = lineIndex;
		arrayLiteral.appendChild(existingCommaToken);
		tokenPair[1].remove();
		arrayLiteral.appendChild(tokenPair[1]);
		arrayLiteral.appendChild(squareRight);
		existingCommaToken.lineIndex = lineIndex;
		newArrayLiteral.appendChild(arrayLiteral);
	});
	newArrayLiteral.appendChild(newSquareRightBracket);
	mapArgList.replaceChild(endBracket, newArrayLiteral);
	mapArgList.appendChild(endBracket);
	const semicolonToken = new ParseTreeToken(';', newSquareRightBracket.lineIndex, 2, ParseTreeTokenType.SEMICOLON);
	mapAssignToken.appendSibling(semicolonToken);
}

export function optimizeMapInitializations(jsCode) {
	// optimizeMapInitializations is often called with code that won't be changed.
	// Checking for 'Map' prevents a lot of needless parsing and checks.
	if (jsCode.indexOf('Map') === -1)
		return jsCode;

	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const interestingTokens = allTokens.filter(isOfInterest);
	if (interestingTokens.length === 0)
		return jsCode;
	interestingTokens.forEach(moveIntoMapConstructor);
	return parseTreeTokensToCode(flatten(parseResult.root));
};