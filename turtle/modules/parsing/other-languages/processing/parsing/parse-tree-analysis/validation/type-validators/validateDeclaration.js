import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const nonCommaChildTypes = new Set([
	
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.IDENTIFIER
]);

export function validateDeclaration(token, parseLogger) {
	const children = token.children;
	if (children.length < 2)
		parseLogger.error(`Expected children length to be at least 2 but found ${children.length}`, token);
	else {
		const first = children[0];
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.ARG_LIST && children.length > 2)
			parseLogger.error(`Expected children length to be exactly 2 for DECLARATION within ARG_LIST but found ${children.length}`, token);

		if (first.type !== ParseTreeTokenType.DATA_TYPE &&
		first.type !== ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION &&
		first.type !== ParseTreeTokenType.EXPRESSION_DOT) {
			if (first.type !== ParseTreeTokenType.IDENTIFIER ||
			first.children.length === 0)
				parseLogger.error(`Expected first child of DECLARATION to be a DATA_TYPE, ARRAY_DATATYPE_EXPRESSION, EXPRESSION_DOT, or IDENTIFIER(with children) but found ${ParseTreeTokenType.getNameFor(first.type)}`, first);
		}
		for (let i = 1; i < children.length; i++) {
			const child = children[i];
			if (i % 2 === 0) {
				if (child.type !== ParseTreeTokenType.COMMA)
					parseLogger.error(`Expected child[${i}] of DECLARATION to be a COMMA but found ${ParseTreeTokenType.getNameFor(child.type)}`, child);
			}
			else if (!nonCommaChildTypes.has(child.type)) {
				parseLogger.error(`Expected child[${i}] of DECLARATION to be from ${Array.from(nonCommaChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found ${ParseTreeTokenType.getNameFor(child.type)}`, child);
			}
		}
	}
};