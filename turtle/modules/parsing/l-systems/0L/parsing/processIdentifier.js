import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { ZeroLProperties } from
'../ZeroLProperties.js';

function shouldCreateCompositeIdentifier(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = prev.parentNode;
	if (parent.type === ParseTreeTokenType.COMMAND_SEQUENCE)
		return false;

	if (prev.val.length !== 1 && prev.val.toLowerCase() !== 'axiom')
		return true;

	const propertyInfo = ZeroLProperties.getPropertyInfo(prev.val);
	return propertyInfo === undefined;
}

export function processIdentifier(prev, next) {
	const prevParent = prev.parentNode;
	if (shouldCreateCompositeIdentifier(prev)) {
		const cId = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.COMPOSITE_IDENTIFIER);
		prevParent.replaceChild(prev, cId);
		cId.appendChild(prev);
		cId.appendChild(next);
		return cId;
	}
	else if (prev.type === ParseTreeTokenType.IDENTIFIER ||
	prev.type === ParseTreeTokenType.COMPOSITE_IDENTIFIER) {
		const assignment = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.ASSIGNMENT);
		prevParent.replaceChild(prev, assignment);
		assignment.appendChild(prev);
		const commandSequence = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.COMMAND_SEQUENCE);
		assignment.appendChild(commandSequence);
		commandSequence.appendChild(next);
		return commandSequence;
	}
	else {
		prev.appendChild(next);
	}
	const parent = next.parentNode;
	if (parent.type === ParseTreeTokenType.COMMAND_SEQUENCE)
		return parent;
	return next;
};