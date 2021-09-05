import { Code } from '../code-editor/Code.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';

/*
'erall' is an action name from FMSLogo.
It erases https://fmslogo.sourceforge.io/manual/command-erall.html
*/
const commandNames = new Set(['erall']);

function findCommandNameOfInterest(tokens) {
	tokens = tokens.filter(t => typeof t.s === 'string' && commandNames.has(t.s.toLowerCase()));
	if (tokens.length !== 0)
		return tokens[0].s.toLowerCase();
}

export class ErAllAction {
	matches(tokens) {
		const commandName = findCommandNameOfInterest(tokens);
		return commandName !== undefined;
	}

	perform(tokens) {
		const commandName = findCommandNameOfInterest(tokens);
		let msg = `All global variables and procedures were erased because you typed ${commandName}.`;
		const executer = Code.executer;
		if (executer !== undefined && executer.isHalted !== true)
			msg	+= `  The program was also halted to prevent confusion.  Removing all global variables and procedures but letting the program continue executing would lead to confusing error messages.`;

		Code.eraseAllGlobalVariablesAndProcedures();
		CommandBoxMessages.warn(msg, false);
	}
};