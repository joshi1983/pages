import { Code } from '../code-editor/Code.js';
import { showIndexSearchDialog } from '../../help/showIndexSearchDialog.js';
import { tokensToLowerCaseStrings } from './tokensToLowerCaseStrings.js';

/*
This action allows people to get help in a way similar to Unix and Linux's man command.
For example, "man fd" will show help regarding the fd/forward command.

"help fd" will behave similarly to "man fd".
*/

const helpAlternatives = new Set(['help', 'man']);

export class HelpAction {
	matches(tokens) {
		if (tokens.length > 3 || typeof Code.sourceCode !== 'string')
			return false;
		tokens = tokensToLowerCaseStrings(tokens);
		if (!helpAlternatives.has(tokens[0]))
			return false;

		const isAProcedure = Code.getProcedures().some(p => helpAlternatives.has(p.name));
		/*
		If there is a procedure with the same name, don't treat it like an action.
		We don't want to needlessly prevent a call to a defined procedure.
		*/
		if (isAProcedure)
			return false;

		return true;
	}

	perform(tokens) {
		const query = tokens.slice(1).map(t => t.s).join(' ');
		showIndexSearchDialog(true, query);
	}
};