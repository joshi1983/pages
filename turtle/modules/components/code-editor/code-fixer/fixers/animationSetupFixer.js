import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { removeStopCallsAndParameters } from './helpers/removeStopCallsAndParameters.js';

export function animationSetupFixer(cachedParseTree, fixLogger) {
	const proc = cachedParseTree.getProceduresMap().get('animation.setup');
	if (proc !== undefined) {
		const startToken = proc.getStartToken();
		removeStopCallsAndParameters(proc, fixLogger, cachedParseTree);
		const procTokens = getDescendentsOfType(startToken, ParseTreeTokenType.PARAMETERIZED_GROUP);
		const animationTimeTokens = CommandCalls.filterCommandCalls(procTokens, 'animation.time');
		animationTimeTokens.forEach(function(animationTimeToken) {
			const parentNode = animationTimeToken.parentNode;
			const zeroToken = new ParseTreeToken(0, null, animationTimeToken.lineIndex, animationTimeToken.colIndex, ParseTreeTokenType.NUMBER_LITERAL);
			cachedParseTree.tokenReplaced(animationTimeToken, zeroToken);
			parentNode.replaceChild(animationTimeToken, zeroToken);
			fixLogger.log("Replaced a call to animation.time with 0 because the procedure must not depend on animation time", animationTimeToken);
		});
	}
};