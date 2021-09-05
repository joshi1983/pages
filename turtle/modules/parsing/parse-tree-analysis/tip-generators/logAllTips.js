import { getAnimationTips } from './getAnimationTips.js';
import { getTipsForJumping } from './getTipsForJumping.js';
import { getTipsForProcOrCommandName } from './getTipsForProcOrCommandName.js';

const tipGenerators = [
getAnimationTips,
getTipsForJumping,
getTipsForProcOrCommandName
];

export function logAllTips(cachedParseTree, parseLogger) {
	tipGenerators.forEach(function(tipGenerator) {
		tipGenerator(cachedParseTree, parseLogger);
	});
};