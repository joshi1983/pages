import { CommandCalls } from '../CommandCalls.js';
import { getAllDescendentsAsArray } from '../../parse-tree-token/getAllDescendentsAsArray.js';
import { validateNoParameterMustOutputProcedure } from './validateNoParameterMustOutputProcedure.js';

export function validateAnimationSetupProcedure(cachedParseTree, parseLogger) {
	const proc = cachedParseTree.getProceduresMap().get('animation.setup');
	if (proc !== undefined) {
		validateNoParameterMustOutputProcedure(proc, parseLogger, 'duration in seconds');
		const startToken = proc.getStartToken();
		const procTokens = getAllDescendentsAsArray(startToken);
		const animationTimeCalls = CommandCalls.filterCommandCalls(procTokens, 'animation.time');
		animationTimeCalls.forEach(function(token) {
			parseLogger.error('The animation.setup procedure must never call animation.time because the animation set up is not something that should depend on time', token);
		});
	}
};