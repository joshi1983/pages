import { Code } from '../code-editor/Code.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { tokensToLowerCaseStrings } from './tokensToLowerCaseStrings.js';

/*
This is to simulate a command from Aquarius Logo.
The command was "LP names".
It would print a list of all currently defined procedures.

A manual entitled "Mattel Electronics Aquarius Logo" can be found at:
https://archive.org/details/mattel-electronics-aquarius-logo/page/n85/mode/2up

*/

const lpAlternatives = new Set(['p', 'print', 'proc', 'procedure', 'show']);

export class PrintProcedureNamesAction {
	matches(tokens) {
		if (tokens.length > 2 || typeof Code.sourceCode !== 'string')
			return false;
		tokens = tokensToLowerCaseStrings(tokens);
		if (tokens[1] !== 'names')
			return false;
		if (tokens[0] === 'lp')
			return true;

		const namesIsAProcedure = Code.getProcedures().some(p => p.name === 'names');
		/*
		If there is a procedure named "names", we'd rather not do this action than 
		prevent execution of possibly real intended Logo code.
		Something like 'print names' might be intended to print returned data from a names procedure.
		*/
		if (namesIsAProcedure)
			return false;

		// if names is not defined as a procedure,
		// we don't need to be as strict about the first token being 'lp'.
		return lpAlternatives.has(tokens[0]);
	}

	perform(tokens) {
		const existingProcedures = Code.getProcedures().map(proc => proc.name);
		if (existingProcedures.length === 0) {
			CommandBoxMessages.print('There are no procedures to print right now.');
			return;
		}
		existingProcedures.sort();
		CommandBoxMessages.print(existingProcedures.join('\n'));
	}
};