import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { ProcessingIdentifiers } from
'../../ProcessingIdentifiers.js';
import { processToken } from
'./processToken.js';

const tokenTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.THIS
]);

function processExpressionDotReadExpression(token, result, settings) {
	const children = token.children;
	const objectName = children[0].val;
	const propToken = children[1];
	if (propToken.children.length === 0)
		return;
	const propertyName = propToken.children[0].val;
	const identifierInfo = ProcessingIdentifiers.getIdentifierInfo(propertyName, true);
	if (identifierInfo !== undefined) {
		if (identifierInfo.to !== undefined) {
			result.append(' ' + identifierInfo.to + ' ');
			processToken(children[0], result, settings);
			return;
		}
	}
	result.append(` getProperty "${objectName} "${propertyName} `);
}

export function isPropertyReadToken(token) {
	if (!tokenTypes.has(token.type) || token.children.length !== 1)
		return false;
	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.DOT)
		return false;
	const children = firstChild.children;
	if (children.length !== 1)
		return false;
	return children[0].type === ParseTreeTokenType.IDENTIFIER;
};

export function processPropertyRead(token, result, settings) {
	if (token.type === ParseTreeTokenType.EXPRESSION_DOT) {
		processExpressionDotReadExpression(token, result, settings);
		return;
	}
	const propertyNameToken = token.children[0].children[0];
	result.trimRight();
	result.append(` ( getProperty "${token.val} "${propertyNameToken.val} ) `);
};