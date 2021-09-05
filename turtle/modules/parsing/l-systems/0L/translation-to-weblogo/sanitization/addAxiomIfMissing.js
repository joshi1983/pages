import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isAxiom } from
'../../parsing/parse-tree-analysis/isAxiom.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function addAxiomIfMissing(root) {
	const axioms = getDescendentsOfType(root, ParseTreeTokenType.ASSIGNMENT).filter(isAxiom);
	if (axioms.length === 0) {
		const axiom = new ParseTreeToken('=', 0, 0, ParseTreeTokenType.ASSIGNMENT);
		const axiomIdentifier = new ParseTreeToken('axiom', 0, 0, ParseTreeTokenType.IDENTIFIER);
		const commandSequence = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.COMMAND_SEQUENCE);
		axiom.appendChild(axiomIdentifier);
		axiom.appendChild(commandSequence);
		root.insertAsFirstChild(axiom);
	}
};