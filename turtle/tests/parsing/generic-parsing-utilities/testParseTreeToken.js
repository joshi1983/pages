import { ParseTreeToken } from '../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function checkParentNodeAndChildren(token, logger) {
	if (token.parentNode !== null) {
		if (token.parentNode.children.indexOf(token) === -1)
			logger(`non-null parentNode found with children that does not contain the token.  token.type = ${token.type}`);
	}
}

function checkParentNodeWithTokens(tokens, logger) {
	tokens.forEach(token => checkParentNodeAndChildren(token, logger));
}

export function testParseTreeToken(logger) {
	const rootToken = new ParseTreeToken(null, 0, 0, 1);
	const child1Token = new ParseTreeToken(null, 0, 0, 2);
	const child2Token = new ParseTreeToken(null, 0, 0, 3);
	const tokens = [rootToken, child1Token, child2Token];
	rootToken.appendChild(child1Token);
	checkParentNodeWithTokens(tokens, prefixWrapper('After appendChild(child1Token)', logger));
	if (rootToken.children.length !== 1)
		logger(`Expected rootToken.children.length to be 1 but got ${rootToken.children.length}`);
	if (child1Token.parentNode !== rootToken)
		logger(`Expected child1Token.parentNode to be the rootToken but got ${child1Token.parentNode}`);
	rootToken.appendChild(child2Token);
	checkParentNodeWithTokens(tokens, prefixWrapper('After appendChild(child2Token)', logger));
	if (rootToken.children.length !== 2)
		logger(`Expected rootToken.children.length to be 2 but got ${rootToken.children.length}`);
	rootToken.removeChild(child1Token);
	checkParentNodeWithTokens(tokens, prefixWrapper('After removeChild(child1Token)', logger));
	if (rootToken.children.length !== 1)
		logger(`after removeChild(child1Token), expected rootToken.children.length to be 1 but got ${rootToken.children.length}`);
	if (child1Token.parentNode !== null)
		logger(`Expected child1Token.parentNode to be null but got ${child1Token.parentNode}`);
	rootToken.removeChild(child2Token);
	checkParentNodeWithTokens(tokens, prefixWrapper('After removeChild(child2Token)', logger));
	if (child2Token.parentNode !== null)
		logger(`Expected child2Token.parentNode to be null but got ${child2Token.parentNode}`);
	if (rootToken.children.length !== 0)
		logger(`after removeChild(child2Token), expected rootToken.children.length to be 0 but got ${rootToken.children.length}`);
};