import { Code } from '../code-editor/Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { EditProcedureAction } from './EditProcedureAction.js';
import { getProcedureInfo } from './getProcedureInfo.js';

export class ToProcedureAction {
	matches(tokens) {
		return getProcedureInfo(tokens, 'to') !== undefined;
	}

	perform(tokens) {
		const procInfo = getProcedureInfo(tokens, 'to');
		const existingProcedures = Code.getProcedures();
		if (existingProcedures.filter(p => p.name.toLowerCase() === procInfo.name.toLowerCase()).length !== 0) {
			EditProcedureAction.editProcedureAt(tokens, 'to');
		}
		else {
			CodeEditor.setSourceCode(procInfo.templateCode + '\n' + CodeEditor.getSourceCode());
			CodeEditor.show();
			CodeEditor.textElement.setCursorPosition(0, 1);
		}
	}
};