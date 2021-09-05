import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const turnCommands = new Set(['left', 'right']);

function isOfInterest(cachedParseTree) {
	const tokenValuesMap = cachedParseTree.getTokenValues();
	return function(token) {
		if (token.previousSibling === null || token.nextSibling === null ||
		token.previousSibling.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
		token.nextSibling.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const prevInfo = Command.getCommandInfo(token.previousSibling.val);
		if (prevInfo === undefined || !turnCommands.has(prevInfo.primaryName))
			return false;
		const nextInfo = Command.getCommandInfo(token.nextSibling.val);
		if (nextInfo === undefined || !turnCommands.has(nextInfo.primaryName))
			return false;
		const prevAngle = tokenValuesMap.get(token.previousSibling.children[0]);
		if (prevAngle !== 90 && prevAngle !== -90)
			return false;
		const nextAngle = tokenValuesMap.get(token.nextSibling.children[0]);
		if (nextAngle !== 90 && nextAngle !== -90)
			return false;
		if (prevInfo.primaryName === nextInfo.primaryName) {
			return prevAngle === -nextAngle;
		}
		else {
			return prevAngle === nextAngle;
		}
	};
}

export function getTipsForJumping(cachedParseTree, parseLogger) {
	const jumpTokens = cachedParseTree.getCommandCallsByNames(['jumpForward', 'jumpBackward']).
		filter(isOfInterest(cachedParseTree));
	jumpTokens.forEach(function(jumpToken) {
		parseLogger.tip(`Consider replacing ${jumpToken.val} along with the previous(${jumpToken.previousSibling.val}) and next(${jumpToken.nextSibling.val}) turn commands with a single call to <span class="command">jumpLeft</span> or <span class="command">jumpRight</span>.  It will be less code.`, jumpToken, true);
	});
};