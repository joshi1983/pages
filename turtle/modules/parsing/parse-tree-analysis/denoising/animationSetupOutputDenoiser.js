import { ArrayUtils } from '../../../ArrayUtils.js';

function isAnimationSetupOutputMessage(msg) {
	return msg.msg.indexOf('animation.setup</span> must always output ') !== -1;
}

function isRemovable(msg) {
	return msg.msg.indexOf('output command requires input of type') !== -1;
}

export function animationSetupOutputDenoiser(cachedParseTree, parseMessages) {
	let outputMessages = parseMessages.filter(isAnimationSetupOutputMessage);
	if (outputMessages.length === 0)
		return;
	const affectedTokens = new Set(outputMessages.map(m => m.token.children[0]));
	outputMessages = new Set(outputMessages);
	ArrayUtils.remove(parseMessages, m => !isRemovable(m) || outputMessages.has(m) || !affectedTokens.has(m.token));
};