import { isAxiom } from './processAssignment.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processTreeRoot(token, result) {
	const children = token.children;
	// process rules.
	for (const rule of children.filter(t => t.type === ParseTreeTokenType.ARROW)) {
		processToken(rule, result);
	}

	// process axiom.  
	// There should be exactly 1 axiom but we'll tolerate a different number.
	const axioms = children.filter(isAxiom);
	for (const axiom of axioms) {
		processToken(axiom, result);
	}
};