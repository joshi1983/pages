import { Command } from '../../Command.js';
import { Keyword } from '../../Keyword.js';
import { scrapeProceduresFromParseTreeTokens } from '../scrapeProceduresFromParseTreeTokens.js';
import { validateIdentifier } from '../validateIdentifier.js';

const restrictedProcedureNames = new Set(['undefined']);

export function validateProcedureNames(cachedParseTree, parseLogger) {
	const procedures = cachedParseTree.getProceduresStrictlyFromTree();
	const procNames = new Set();
	procedures.forEach(function(proc) {
		const commandInfo = Command.getCommandInfo(proc.name);
		if (commandInfo !== undefined)
			parseLogger.error('Procedure name ' + proc.name + ' matches a built-in command.  WebLogo does not let you redefine internal commands because that would make it harder to trust internal commands to do what documentation says they do.  If you want to make your code run as if a command was swapped with your procedure, implement your procedure with an acceptable procedure name and replace every call to the command with your procedure\'s name.', proc.nameToken);
		else {
			// look for a matching keyword.
			const keyword = Keyword.getKeywordInfo(proc.name);
			if (keyword !== undefined)
				parseLogger.error('Procedure name ' + proc.name + ' matched a keyword', proc.nameToken);
		}

		// Look for duplicate procedure names.
		const procNameLowerCase = proc.name.toLowerCase();
		if (restrictedProcedureNames.has(procNameLowerCase))
			parseLogger.error(`Procedure name ${proc.name} is not allowed because it is restricted.  The restricted procedure names are: ${Array.from(restrictedProcedureNames)}.`, proc.nameToken);
		else if (procNames.has(procNameLowerCase))
			parseLogger.error(`Procedure name ${proc.name} matches an existing procedure`, proc.nameToken);
		else
			procNames.add(procNameLowerCase);
		const validationMessage = validateIdentifier(procNameLowerCase);
		if (validationMessage !== undefined)
			parseLogger.error('Procedure name ' + proc.name + ' is invalid. A procedure name ' + validationMessage, proc.nameToken);
	});
};