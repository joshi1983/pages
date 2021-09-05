import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processImport } from './processImport.js';

const importLikeNames = new Set([
	'imrt', 'imprt', 'imprto', 'imptr', 'imptro'
]);

function shouldBecomeImport(prev, next) {
	if (!importLikeNames.has(next.val))
		return false;
	if (prev.type === ParseTreeTokenType.TREE_ROOT && prev.children.length !== 0)
		prev = prev.children[prev.children.length - 1];

	let tok = prev.getPreviousSibling();
	if (tok === null)
		return false;

	return tok.val === 'from';
}

export function processIdentifier(prev, next) {
	if (shouldBecomeImport(prev, next)) {
		next.val = 'import';
		processImport(prev, next);
		return;
	}
	prev.appendChild(next);
	return next;
};