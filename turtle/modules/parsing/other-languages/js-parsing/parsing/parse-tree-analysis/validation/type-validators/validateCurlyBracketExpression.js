import { evaluateStringLiteral } from '../../../../evaluateStringLiteral.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const objectChildTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA
]);

function validateDuplicateKey(token, parseLogger) {
	const keyValues = new Set();
	const children = token.children;
	for (let i = 1; i < children.length - 1; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.COLON && child.children.length !== 0) {
			const firstGrandChild = child.children[0];
			if (firstGrandChild.type === ParseTreeTokenType.IDENTIFIER ||
			firstGrandChild.type === ParseTreeTokenType.STRING_LITERAL) {
				const val = firstGrandChild.type === ParseTreeTokenType.IDENTIFIER ?
					firstGrandChild.val : evaluateStringLiteral(firstGrandChild.val);
				if (keyValues.has(val))
					parseLogger.warn(`Duplicate key ${val} in curly bracket expression`, firstGrandChild);
				keyValues.add(val);
			}
		}
	}
}

function validateDirectChildTypesForObjectExpression(token, parseLogger) {
	const children = token.children;
	if (children.length >= 2) {
		const children = token.children;
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		if (firstChild.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			parseLogger.error(`First child of a CURLY_BRACKET_EXPRESSION should be a { but got ${ParseTreeTokenType.getNameFor(firstChild.type)}`, token);
		if (lastChild.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			parseLogger.error(`Last child of a CURLY_BRACKET_EXPRESSION should be a } but got ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
		for (let i = 1; i < children.length - 1; i++) {
			const child = children[i];
			if (!objectChildTypes.has(child.type)) {
				parseLogger.error(`Middle children of CURLY_BRACKET_EXPRESSION should be from ${Array.from(objectChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(child.type)}`, child);
			}
		}
	}
}

function isObjectExpression(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.IMPORT ||
	parent.type === ParseTreeTokenType.EXPORT)
		return false;
	return true;
}

export function validateCurlyBracketExpression(token, parseLogger) {
	if (isObjectExpression(token)) {
		validateDirectChildTypesForObjectExpression(token, parseLogger);
		validateDuplicateKey(token, parseLogger);
	}
};