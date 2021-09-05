import { CommandCalls } from '../CommandCalls.js';
import { getAllDescendentsAsArray } from '../../parse-tree-token/getAllDescendentsAsArray.js';
import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { isVariableReadWithinToken } from '../isVariableReadWithinToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateOverwrittenParameters(cachedParseTree, parseLogger) {
	const procs = cachedParseTree.getProceduresStrictlyFromTree();
	for (const proc of procs.values()) {
		if (proc.parameters.length === 0)
			continue;
		const instructionListToken = proc.getInstructionListToken();
		if (instructionListToken === undefined)
			continue;
		const allTokens = getAllDescendentsAsArray(instructionListToken).
			filter(token => token.type === ParseTreeTokenType.PARAMETERIZED_GROUP);
		getParseTokensSorted(allTokens);
		const tokens = CommandCalls.filterCommandCalls(allTokens, ['localmake', 'make']);
		if (tokens.length === 0)
			continue;
		proc.parameters.
			filter(parameter => isVariableReadWithinToken(parameter, instructionListToken)).
			forEach(function(parameter, index) {
				const overwrites = tokens.filter(tok => tok.children.length === 2 &&
					tok.children[0].isStringLiteral() &&
					tok.children[0].val.toLowerCase() === parameter);
				if (overwrites.length > 0) {
					const firstOverwrite = overwrites[0];
					const firstOverwriteIndex = allTokens.indexOf(firstOverwrite);
					for (let i = 0; i <= firstOverwriteIndex; i++) {
						const token = allTokens[i];
						if (isVariableReadWithinToken(parameter, token)) {
							return;
						}
					}
					let paramToken = proc.getTokenForParameter(index);
					parseLogger.warn(`The value passed to parameter ${parameter} is not used.  ${parameter} is assigned a new value using the ${firstOverwrite.val} command before ${parameter} gets read.`, paramToken);
				}
		});
	}
};