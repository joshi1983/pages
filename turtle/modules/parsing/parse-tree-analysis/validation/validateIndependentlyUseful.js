import { alreadyTippedForLeafCluster } from '../alreadyTippedForLeafCluster.js';
import { Command } from '../../Command.js';
import { isFirstLevelInstruction } from '../isFirstLevelInstruction.js';
import { isIndependentlyUseful } from '../isIndependentlyUseful.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { validateIdentifier } from '../validateIdentifier.js';

export function validateIndependentlyUseful(cachedParseTree, parseLogger) {
	const firstLevelInstructions = cachedParseTree.getAllTokens().filter(isFirstLevelInstruction);
	firstLevelInstructions.forEach(function(token) {
		if (token.type === ParseTreeTokenType.LEAF) {
			// We don't want the user given lots of noisy messages if a tip was already given to fix the problem.
			if (validateIdentifier(token.val) !== undefined &&
			!alreadyTippedForLeafCluster(token, parseLogger)) {
				if (token.isBracket())
					parseLogger.error('Unmatched/unbalanced bracket(' + token.val + ')', token);
				else
					parseLogger.error('Unrecognized symbol(' + token.val + ')', token);
			}
		}
		else if (!isIndependentlyUseful(token, cachedParseTree.getProceduresMap())) {
			let showWarning = true;
			if (typeof token.val === 'string') {
				const commandInfo = Command.getCommandInfo(token.val);
				/* We don't want a lot of noisy warnings that overlap each other so if the input count is wrong for this token, 
				assume another validator explains the problem better and well enough that this warning will only be noise. */
				if (commandInfo !== undefined) {
					const argCount = Command.getArgCount(commandInfo);
					if (!argCount.isFlexible && argCount.defaultCount !== token.children.length)
						showWarning = false;
					if (commandInfo.commandGroup === 'compiled') {
						showWarning = false;
						parseLogger.warn(`"${token.toString()}" does not do anything useful.  Did you forget to add instructions to an instruction list?`, token);
					}
				}
			}
			if (showWarning) {
				let extra = '';
				if (typeof token.originalString === 'string' && token.originalString.length > 1 &&
				(token.originalString.startsWith('-') || token.originalString.startsWith('+')))
					extra = `If you want the - or + operators to operate with 2 inputs, add a space such as "${token.originalString.charAt(0) + ' ' + token.originalString.substring(1)}".`;
				parseLogger.warn(`"${token.toString()}" may calculate a value but does not do anything with it.  Did you forget to print it or assign it to a variable? ${extra}`, token);
			}
		}
	});
};