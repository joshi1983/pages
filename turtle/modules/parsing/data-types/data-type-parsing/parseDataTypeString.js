import { ParseTreeToken } from './ParseTreeToken.js';
import { DataTypeTokenType } from './DataTypeTokenType.js';
import { isName } from './isName.js';
import { scanDataTypeString } from './scanDataTypeString.js';

function getClosestOfType(token, type) {
	while (token.type !== type) {
		token = token.parentNode;
	}
	return token;
}

function genericTypeMatch() {
	const types = new Set(arguments);
	return function(token) {
		return types.has(token.type);
	};
}

function aboveCheck(token, checker) {
	if (typeof token !== 'object')
		throw new Error(`aboveCheck token must be an object but got ${token}`);
	while (token.type !== DataTypeTokenType.TREE_ROOT) {
		if (checker(token))
			break;
		token = token.parentNode;
	}
	if (token.parentNode === null)
		return token;
	return token.parentNode;
}

function aboveType(token, type) {
	if (!Number.isInteger(type))
		throw new Error(`The type must be an integer but found ${type}`);
	return aboveCheck(token, genericTypeMatch(type));
}

function aboveTypes(token) {
	const types = Array.from(arguments).slice(1);
	return aboveCheck(token, genericTypeMatch(...types));
}

export function parseDataTypeString(s) {
	const scanTokens = scanDataTypeString(s);
	const root = new ParseTreeToken(null, DataTypeTokenType.TREE_ROOT);
	let currentToken = root;
	for (let i = 0; i < scanTokens.length; i++) {
		const scanToken = scanTokens[i];
		if (scanToken.s === '<') {
			let nextToken;
			const nextScanToken = scanTokens[i + 1];
			if (nextScanToken === undefined)
				throw new Error('Unable to parse.  < is not supposed to be the last scanned token.');
			else if (nextScanToken.s === '>')
				continue; // empty templates don't need a token.
			else {
				nextToken = new ParseTreeToken(null, DataTypeTokenType.TEMPLATE_EXPRESSION);
			}
			currentToken.appendChild(nextToken);
			currentToken = nextToken;
		}
		else if (scanToken.s === '>') {
			currentToken = aboveType(currentToken, DataTypeTokenType.TEMPLATE_EXPRESSION);
		}
		else if (scanToken.s === ')') {
			currentToken = aboveType(currentToken, DataTypeTokenType.ATTRIBUTES_EXPRESSION);
		}
		else if (scanToken.s === '|') {
			currentToken = aboveTypes(currentToken, DataTypeTokenType.NAME,
				DataTypeTokenType.WILDCARD);
		}
		else if (scanToken.s === ',') {
			currentToken = getClosestOfType(currentToken, DataTypeTokenType.ATTRIBUTES_EXPRESSION);
		}
		else if (scanToken.s === '=') {
			let prev = currentToken;
			if (prev.children.length !== 0)
				prev = prev.children[prev.children.length - 1];
			const parent = prev.parentNode;
			const newToken = new ParseTreeToken(null, DataTypeTokenType.ASSIGNMENT);
			prev.remove();
			newToken.appendChild(prev);
			parent.appendChild(newToken);
			currentToken = newToken;
		}
		else if (scanToken.s === '(') {
			const nextScanToken = scanTokens[i + 1];
			if (nextScanToken !== undefined && nextScanToken.s === ')')
				continue; // empty attributes expression doesn't need a token.
			const attributeExpression = new ParseTreeToken(null, DataTypeTokenType.ATTRIBUTES_EXPRESSION);
			currentToken.appendChild(attributeExpression);
			currentToken = attributeExpression;
		}
		else if (scanToken.s === '*' || isName(scanToken.s)) {
			let type = DataTypeTokenType.NAME;
			if (scanToken.s === '*')
				type = DataTypeTokenType.WILDCARD;
			const nextToken = new ParseTreeToken(scanToken.s, type);
			currentToken.appendChild(nextToken);
			currentToken = nextToken;
		}
	}
	return root;
};