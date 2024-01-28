import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function trimQuotes(s) {
	if (s.length >= 2 && (
		(s.startsWith('"') && s.endsWith('"')) ||
		(s.startsWith('\'') && s.endsWith('\''))
	)) {
		if (s.length >= 6) {
			if (s.startsWith('"""') && s.endsWith('"""'))
				return s.substring(3, s.length - 3);
			if (s.startsWith('\'\'\'') && s.endsWith('\'\'\''))
				return s.substring(3, s.length - 3);
		}
		return s.substring(1, s.length - 1);
	}
	else
		return s;
}

function sanitizeTerminalNodeValue(s) {
	return trimQuotes(s);
}

function getFunctionNameFromAtomExprContext(token) {
	token = token.children[0];
	for (;token.children !== undefined && token.children.length === 1; token = token.children[0]);
	return token.symbol.text;
}

export function getVal(token, code, type) {
	if (type === ParseTreeTokenType.UNRECOGNIZED)
		return null;
	const constructorName = token.constructor.name;
	if (Number.isInteger(token.start) && Number.isInteger(token.stop))
		return code.substring(token.start, token.stop + 1);
	else if (constructorName === 'TerminalNodeImpl')
		return sanitizeTerminalNodeValue(token.symbol.text);
	else if (constructorName === 'Atom_exprContext' && token.children.length === 2)
		return getFunctionNameFromAtomExprContext(token);
	else
		return null;
};