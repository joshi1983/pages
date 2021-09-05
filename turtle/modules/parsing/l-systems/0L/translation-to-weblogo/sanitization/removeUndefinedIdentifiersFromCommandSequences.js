import { CommandSymbols } from
'../../CommandSymbols.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(root) {
	const arrows = getDescendentsOfType(root, ParseTreeTokenType.ARROW).
		filter(arrow => arrow.children.length !== 0 &&
			arrow.children[0].type === ParseTreeTokenType.IDENTIFIER);
	const identifierSet = new Set(arrows.map(arrow => arrow.children[0].val));

	return function(identifier) {
		const parent = identifier.parentNode;
		if (parent.type !== ParseTreeTokenType.COMMAND_SEQUENCE)
			return false;
		if (CommandSymbols.getCommandInfo(identifier.val) !== undefined)
			return false;

		return !identifierSet.has(identifier.val);
	};
}

export function removeUndefinedIdentifiersFromCommandSequences(root) {
	const identifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(isOfInterest(root));
	identifiers.forEach(function(identifier) {
		const next = identifier.getNextSibling();
		identifier.remove();
		
		// If the next token applies to the identifier being removed, remove it too.
		// We don't want to change the meaning of the number by applying it to a different command.
		if (next !== null && next.type === ParseTreeTokenType.NUMBER_LITERAL)
			next.remove();
	});
};