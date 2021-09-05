import { alreadyTippedForLeafCluster } from '../alreadyTippedForLeafCluster.js';
import { Colour } from '../../../Colour.js';
import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { getAllLocalVariablesAndParameters } from '../variableWriting.js';
import { isInProcedure } from '../isInProcedure.js';
import { findLongestMatch, signedNumberRegEx } from '../../scanning/Numbers.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Procedure } from '../../Procedure.js';
import { UnsupportedCommand } from '../../UnsupportedCommand.js';
import { validateIdentifier } from '../validateIdentifier.js';

export function validateUnrecognizedParameterizedGroupNames(cachedParseTree, parseLogger) {
	const tokens = getTokensByType(cachedParseTree, ParseTreeTokenType.LEAF).
	filter(function(token) {
		if (Procedure.isNameToken(token))
			return false;
		if (token.parentNode !== null && CommandCalls.tokenMatchesPrimaryName(token.parentNode, 'to'))
			return false;
		return !alreadyTippedForLeafCluster(token, parseLogger) &&
			!token.isBracketOrBinaryOperator() &&
			!cachedParseTree.getProceduresMap().has(token.val.toLowerCase()) &&
			Command.getCommandInfo(token.val) === undefined; 
			/* command names and procedure names may parse as LEAF if not enough inputs are given to them.
			We exclude them here because those names are recognized and other validators will 
			complain appropriately about the number of inputs.
			*/
	});
	const allPossibleGlobalVariables = cachedParseTree.getAllPossibleGlobalVariables();
	function isPossibleVariable(token) {
		if (allPossibleGlobalVariables.has(token.val.toLowerCase()))
			return true;
		if (!isInProcedure(token))
			return false;
		const localVariables = getAllLocalVariablesAndParameters(token);
		return localVariables.has(token.val.toLowerCase());
	}
	tokens.forEach(function(token) {
		let extra = '';
		if (signedNumberRegEx.test(token.val))
			extra = `. If you meant to type a number, it is invalid.  ${token.val} starts with a valid number of ${findLongestMatch(token.val)} but at least one character is invalid.`;
		else if (isPossibleVariable(token))
			extra = `. If you meant to read a variable, remember to add a : such as :${token.val}.`;
		else if (token.val.charAt(0) === ',' || token.val.charAt(token.val.length - 1) === ',')
			extra = '. Use a space instead of a comma if you want to separate arguments or commands.';
		else if (Colour.canBeInterprettedAsColour(token.val))
			extra = `. If you want this to describe a color, add a quotation mark(") before it like "${token.val}`;
		else {
			const info = Command.getCommandInfoByHintName(token.val);
			if (info !== undefined) {
				if (token.val.toLowerCase() === 'return')
					extra = '. Instead of using return to mark the end of a procedure or return from executing it, '+
						'use <span class=\"command\">stop</span>, <span class=\"command\">output</span>, or end.  '+
						'\'end\' marks the end of a procedure in WebLogo.  <span class=\"command\">stop</span> is an'+
						' instruction to stop execution and return nothing to the caller.  '+
						'<span class=\"command\">output</span> returns a specified value back to the caller.';
				else
					extra = `. Consider using the "<span class="command">${info.primaryName}</span>" command instead of "${token.val}"`;
			}
			else {
				if (token.val.indexOf('.') !== -1) {
					const lastPartIndex = token.val.lastIndexOf('.');
					const lastPart = token.val.substring(lastPartIndex + 1);
					const commandInfo = Command.getCommandInfo(lastPart);
					if (commandInfo !== undefined) {
						extra = `.  Did you mean <span class="command">${lastPart}</span>?  <span class="command">${commandInfo.primaryName}</span> is a recognized command.`;
					}
					else if (cachedParseTree.getProcedureByName(lastPart.toLowerCase()) !== undefined) {
						extra = `.  Did you mean ${lastPart}?  ${lastPart} is a recognized procedure.`;
					}
				}
				if (extra === '') {
					const unsupportedInfo = UnsupportedCommand.getUnsupportedCommandInfo(token.val);
					if (unsupportedInfo !== undefined)
						extra = `. ${unsupportedInfo.reason}`;
					else if (validateIdentifier(token.val) === undefined)
						extra = `. You can define the ${token.val} procedure using <span class="command">to</span>.`;
				}
			}
		}
		parseLogger.error(`I don't know how to <strong>${token.val}</strong>.  "<strong>${token.val}</strong>" is not a recognized command or procedure name.` + extra, token, true);
	});
};