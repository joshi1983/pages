import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getDescendentsOfType } from '../../../../parsing/parse-tree-token/getDescendentsOfType.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { removeStopCallsAndParameters } from './removeStopCallsAndParameters.js';

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
		const outputCalls = CommandCalls.filterCommandCalls(procTokens, 'output');
		const instructionListToken = proc.getInstructionListToken();
		const endToken = proc.getEndToken();
		// if no output call is found, add one.
		if (endToken !== undefined && instructionListToken !== undefined && outputCalls.length === 0) {
			const outputToken = new ParseTreeToken('output', null, endToken.lineIndex, endToken.colIndex - 2, ParseTreeTokenType.PARAMETERIZED_GROUP);
			const secondsToken = new ParseTreeToken(10, null, outputToken.lineIndex, outputToken.colIndex, ParseTreeTokenType.NUMBER_LITERAL);
			cachedParseTree.tokensAdded([secondsToken, outputToken]);
			outputToken.appendChild(secondsToken);
			instructionListToken.appendChild(outputToken);
			fixLogger.log('Added "Output 10" to animation.setup because the procedure must always output a number', endToken);
		}
	}
};