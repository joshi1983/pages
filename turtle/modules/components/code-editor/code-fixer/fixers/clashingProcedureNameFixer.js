import { Command } from '../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
await Command.asyncInit();

function isOfInterest(token) {
	if (!Procedure.isNameToken(token))
		return false;
	const info = Command.getCommandInfo(token.val);
	return info !== undefined;
}

export function clashingProcedureNameFixer(cachedParseTree, fixLogger) {
	const clashingProcedureNameTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	const paramGroupTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);
	const procedureNamesLowerCase = new Set(cachedParseTree.proceduresMap.keys());
	function getNewNameFor(oldName) {
		for (let i = 2; true; i++) {
			const newName = oldName + i;
			if (Command.getCommandInfo(newName) !== undefined)
				continue;
			if (!procedureNamesLowerCase.has(newName.toLowerCase()))
				return newName;
		}
	}
	const renames = new Map();
	clashingProcedureNameTokens.forEach(function(nameToken) {
		const oldVal = nameToken.val;
		const newName = getNewNameFor(oldVal);
		const info = Command.getCommandInfo(oldVal);
		renames.set(oldVal.toLowerCase(), newName);
		nameToken.val = newName;
		cachedParseTree.tokenValueChanged(nameToken, oldVal);
		fixLogger.log(`Renamed ${oldVal} to ${newName} because ${oldVal} clashed with <span class="command">${info.primaryName}</span>, a built in command.`, nameToken, true);
		procedureNamesLowerCase.add(newName.toLowerCase());
		const proc = cachedParseTree.proceduresMap.get(oldVal.toLowerCase());
		if (proc !== undefined) {
			proc.name = newName.toLowerCase();
			cachedParseTree.proceduresMap.delete(oldVal.toLowerCase());
			cachedParseTree.proceduresMap.set(proc.name, proc);
		}
	});
	// Update the procedure calls to avoid the clash.
	paramGroupTokens.forEach(function(token) {
		const oldVal = token.val;
		const newName = renames.get(token.val.toLowerCase());
		if (newName !== undefined) {
			token.val = newName;
			cachedParseTree.tokenValueChanged(token, oldVal);
		}
	});
};