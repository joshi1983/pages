import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { ZeroLProperties } from
'../ZeroLProperties.js';

function shouldAddCommandSequence(prev) {
	if (typeof prev.val !== 'string')
		return false;

	const propertyInfo = ZeroLProperties.getPropertyInfo(prev.val);
	return propertyInfo !== undefined && propertyInfo.primaryName === 'axiom';
}

export function processAssignment(prev, next) {
	if (prev.type === ParseTreeTokenType.IDENTIFIER ||
	prev.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		next.appendChild(prev);
		if (shouldAddCommandSequence(prev)) {
			const commandSequence = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.COMMAND_SEQUENCE);
			next.appendChild(commandSequence);
			return commandSequence;
		}
	}
	return next;
};