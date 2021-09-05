import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const pairsToRemove = [
	"+-", "-+", "||", "&&", "[]", "#!", "!#", "><", "<>", "()", ")("
];

function removeCancelledCommandPairs(commandSequence) {
	for (let i = 1; i < commandSequence.children.length; i++) {
		const children = commandSequence.children;
		const tok = children[i];
		const prev = children[i - 1];
		const next = children[i + 1];
		if (
		(next === undefined || next.type !== ParseTreeTokenType.NUMBER_LITERAL) &&
		pairsToRemove.indexOf(prev.val + tok.val) !== -1) {
			
			tok.remove();
			prev.remove();
			i = Math.max(0, i - 2);
		}
	}
}

export function simplifyCommandSequence(root) {
	const commandSequences = getDescendentsOfType(root, ParseTreeTokenType.COMMAND_SEQUENCE);
	for (const commandSequence of commandSequences) {
		removeCancelledCommandPairs(commandSequence);
	}
};