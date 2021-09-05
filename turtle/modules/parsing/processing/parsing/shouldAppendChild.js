import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { isCompleteSquareBracketExpression } from './isCompleteSquareBracketExpression.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const codeBlockParentTypes = new Set([
	ParseTreeTokenType.DO
]);
const parentChildTypes = new Map([
	[ParseTreeTokenType.DOT, [
		ParseTreeTokenType.IDENTIFIER
	]],
	[ParseTreeTokenType.CLASS_BODY, [
		ParseTreeTokenType.ASYNC,
		ParseTreeTokenType.IDENTIFIER,
		ParseTreeTokenType.STATIC,
	]],
	[ParseTreeTokenType.IMPORT, {
		'notContainedImpliesFalse': true,
		'types': [
			ParseTreeTokenType.IDENTIFIER
	]}],
	[ParseTreeTokenType.METHOD, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.CODE_BLOCK,
		ParseTreeTokenType.GENERATOR_STAR,
		ParseTreeTokenType.IDENTIFIER,
	]],
	[ParseTreeTokenType.STRING_LITERAL, [
		ParseTreeTokenType.DOT,
		ParseTreeTokenType.INDEX_EXPRESSION
	]],
]);
Array.from(parentChildTypes.keys()).forEach(function(key) {
	const types = parentChildTypes.get(key);
	parentChildTypes.set(key, {
		'notContainedImpliesFalse': types.notContainedImpliesFalse === true,
		'types': new Set(types instanceof Array ? types : types.types)
	});
});

function isClosedCodeBlock(token) {
	return token.type === ParseTreeTokenType.CODE_BLOCK && endsWithCurlyRightBracket(token);
}

function isCompleteFunctionDefinition(token) {
	return token.type === ParseTreeTokenType.METHOD &&
	token.children.length >= 2 &&
	token.children[token.children.length - 1].type === ParseTreeTokenType.CODE_BLOCK;
}

export function shouldAppendChild(fromToken, newToken) {
	if (fromToken.type === ParseTreeTokenType.TREE_ROOT || fromToken.parentNode === null)
		return true; // must append child.  You can't append a sibling to the TREE_ROOT.
	if (isClosedCodeBlock(fromToken))
		return false;
	const childTypes = parentChildTypes.get(fromToken.type);
	if (childTypes !== undefined) {
		if (childTypes.types.has(newToken.type))
			return true;
		else if (childTypes.notContainedImpliesFalse)
			return false;
	}
	const numChildrenExpected = getExpectedChildrenLengthForToken(fromToken);
	if (numChildrenExpected === 0)
		return false;
	if (isCompleteFunctionDefinition(fromToken))
		return false;
	if (isCompleteSquareBracketExpression(fromToken))
		return false;
	if (fromToken.type === ParseTreeTokenType.CODE_BLOCK && codeBlockParentTypes.has(fromToken.parentNode.type))
		return false;
	if (fromToken.type === ParseTreeTokenType.COLON && fromToken.parentNode.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		return false;
	if (fromToken.type === ParseTreeTokenType.IF && fromToken.children.length > 0)
		return false;
	if (numChildrenExpected !== undefined && numChildrenExpected <= fromToken.children.length)
		return false;

	return true;
};