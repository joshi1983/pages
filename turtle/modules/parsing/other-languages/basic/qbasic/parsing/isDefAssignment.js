import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isDefAssignment(def) {
	if (def.type !== ParseTreeTokenType.DEF ||
	def.children.length !== 1)
		return false;
	const first = def.children[0];
	if (first.val !== '=' ||
	first.children.length !== 2)
		return false;
	return true;
};