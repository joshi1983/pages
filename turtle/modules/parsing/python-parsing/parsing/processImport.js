import { createTokenFromToken } from './createTokenFromToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const importChildTypes = new Set([
	ParseTreeTokenType.ASTRIX_WILDCARD,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IMPORT
]);

function shouldAddImport(prev) {
	if (prev.type !== ParseTreeTokenType.IMPORT)
		return true;
	return false;
}

function shouldGetAddedAsImportChild(prev, next) {
	if (prev === null)
		return false;
	if (!importChildTypes.has(prev.type))
		return false;
	return prev.lineIndex === next.lineIndex;
}

export function processImport(prev, next) {
	if (shouldAddImport(prev)) {
		let tok = prev;
		if (tok.type === ParseTreeTokenType.TREE_ROOT &&
		tok.children.length !== 0)
			tok = tok.children[tok.children.length - 1];

		const importToken = createTokenFromToken(null, next, ParseTreeTokenType.IMPORT);
		let token = tok.getPreviousSibling();
		while (shouldGetAddedAsImportChild(token, tok)) {
			token.remove();
			importToken.insertAsFirstChild(token);
			token = tok.getPreviousSibling();
		}
		if (shouldGetAddedAsImportChild(tok, next)) {
			tok.remove();
			importToken.appendChild(tok);
		}
		prev.appendChild(importToken);
		prev = importToken;
	}
	prev.appendChild(next);
	return prev;
};