import { getProcedureStartToken } from '../getProcedureStartToken.js';
import { tokenToProcedure } from '../tokenToProcedure.js';

export function validateAnimationTimeUsage(cachedParseTree, parseLogger) {
	const animationTimeTokens = cachedParseTree.getCommandCallsByName('animation.time').filter(function(token) {
		const procStartToken = getProcedureStartToken(token);
		if (procStartToken === undefined)
			return false;
		else {
			const proc = tokenToProcedure(procStartToken);
			return proc.name === 'animation.setup';
		}
	});
	animationTimeTokens.forEach(function(token) {
		parseLogger.warn('The animation.setup procedure has no good reason to call animtion.time.  The setup procedure should simply return the animation\s duration and any other properties related to the animation.  animation.time returns the currently previewed time that you are looking at.', token);
	});
};