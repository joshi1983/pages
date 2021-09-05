import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processImport } from './processImport.js';

const importLikeNames = new Set([
	'imrt', 'imprt', 'imprto', 'imptr', 'imptro'
]);

function shouldBecomeImport(prev, next) {
	if (!importLikeNames.has(next.val))
		return false; // not similar enough to "import" to be converted.

	if (prev.type === ParseTreeTokenType.TREE_ROOT) {
		if (prev.children.length === 0)
			return true; // the first token in the Python code is likely an import.

		prev = prev.children[prev.children.length - 1];
		if (prev.type === ParseTreeTokenType.IMPORT)
			return true;
	}
	let tok = prev.getPreviousSibling();
	if (tok === null)
		return false;

	return tok.val === 'from';
}

export function processIdentifier(prev, next) {
	if (shouldBecomeImport(prev, next)) {
		next.val = 'import';
		next.type = ParseTreeTokenType.IMPORT;
		processImport(prev, next);
		return;
	}
	prev.appendChild(next);
	return next;
};