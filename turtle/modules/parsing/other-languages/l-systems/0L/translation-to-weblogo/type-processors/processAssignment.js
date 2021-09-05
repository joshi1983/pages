import { isAxiom } from '../../parsing/parse-tree-analysis/isAxiom.js';
import { processToken } from './processToken.js';

export function processAssignment(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (isAxiom(token)) {
		result.append('to axiom :n :length\n');
		const commandSequence = token.children[1];
		for (const commandSymbol of commandSequence.children) {
			processToken(commandSymbol, result, settings);
		}
		result.append('\nend\n');
	}
};