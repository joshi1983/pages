import { EdAllAction } from './EdAllAction.js';
import { EditProcedureAction } from './EditProcedureAction.js';
import { LogoScanner } from '../../parsing/LogoScanner.js';
import { PrintProcedureNamesAction } from './PrintProcedureNamesAction.js';
import { ToProcedureAction } from './ToProcedureAction.js';
import { UnsupportedCommandAction } from './UnsupportedCommandAction.js';
await LogoScanner.asyncInit();

const actions = [
	new EdAllAction(),
	new EditProcedureAction(),
	new PrintProcedureNamesAction(),
	new ToProcedureAction(),
	new UnsupportedCommandAction()
];

export function compositeAction(s) {
	const tokens = LogoScanner.scan(s);
	for (let i = 0; i < actions.length; i++) {
		const action = actions[i];
		if (action.matches(tokens)) {
			action.perform(tokens);
			return true; // indicate an action was performed.
		}
	}
	return false;
};