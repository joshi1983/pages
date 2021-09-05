import { isAxiom } from '../../parsing/parse-tree-analysis/isAxiom.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processTreeRoot(token, result, settings) {
	const children = token.children;
	// process rules.
	for (const rule of children.filter(t => t.type === ParseTreeTokenType.ARROW)) {
		processToken(rule, result, settings);
	}
	

	// process axiom.
	// There should be exactly 1 axiom but we'll tolerate a different number.
	const axioms = children.filter(isAxiom);
	for (const axiom of axioms) {
		processToken(axiom, result, settings);
	}
};