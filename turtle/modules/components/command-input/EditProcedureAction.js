import { Code } from '../code-editor/Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { getProcedureInfo } from './getProcedureInfo.js';

export class EditProcedureAction {
	matches(tokens) {
		return getProcedureInfo(tokens, 'edit') !== undefined;
	}

	static editProcedureAt(tokens, uiCommandLowerCase) {
		if (typeof uiCommandLowerCase !== 'string')
			throw new Error('uiCommandLowerCase must be a string');

		const procInfo = getProcedureInfo(tokens, uiCommandLowerCase);
		const existingProcedures = Code.getProcedures();
		const matchedProc = existingProcedures.filter(p => p.name.toLowerCase() === procInfo.name.toLowerCase())[0];
		CodeEditor.show();

		if (matchedProc !== undefined) {
			const pos = matchedProc.getImplementationStartCursorPosition();
			if (pos !== undefined)
				CodeEditor.textElement.setCursorPosition(pos.colIndex, pos.lineIndex);
		}
		else if (procInfo.name !== '') {
			CommandBoxMessages.warn('Unable to edit procedure ' + procInfo.name + ' because it does not yet exist.  Showing code editor anyway in case you want to add it or rename an existing procedure to that.', false);
		}
	}

	perform(tokens) {
		EditProcedureAction.editProcedureAt(tokens, 'edit');
	}
};