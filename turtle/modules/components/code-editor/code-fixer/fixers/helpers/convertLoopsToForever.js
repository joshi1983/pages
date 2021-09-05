import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { Command } from
'../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

const namesOfInterest = new Map([
	['do.while', true],
	['until', false],
	['while', true]
]);
export { namesOfInterest };

function getNonInstructionListChildToken(loopToken) {
	const info = Command.getCommandInfo(loopToken.val);
	const nonInstructionListParamIndex = ArrayUtils.indexOfMatch(info.args, a => a.types !== 'instructionlist');
	return loopToken.children[nonInstructionListParamIndex];
}

function isOfInterest(token) {
	const infiniteVal = namesOfInterest.get(token.val.toLowerCase());
	if (infiniteVal === undefined ||
	token.children.length !== 2)
		return false;

	const child = getNonInstructionListChildToken(token);
	if (child === undefined ||
	child.type !== ParseTreeTokenType.BOOLEAN_LITERAL ||
	child.val !== infiniteVal)
		return false;

	return true;
}

export function convertLoopsToForever(cachedParseTree, fixLogger) {
	const loops = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	loops.forEach(function(loopToken) {
		const oldVal = loopToken.val;
		const child = getNonInstructionListChildToken(loopToken);
		loopToken.val = 'forever';
		child.remove();
		cachedParseTree.tokenRemoved(child);
		
		fixLogger.log(`Converted unconditional ${oldVal} loop to forever because forever is a simpler way of writing unconditional loops.`, loopToken);
	});
	return loops.length !== 0;
}