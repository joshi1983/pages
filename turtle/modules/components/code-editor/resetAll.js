import { Code } from './Code.js';
import { CodeEditor } from './CodeEditor.js';
import { clearClicked } from '../../drawing-menu/DrawingClear.js';
import { Settings } from '../../Settings.js';
import { ToastMessages } from '../ToastMessages.js';
const resetAllItem = document.getElementById('editor-reset-all');

function resetAll() {
	Settings.turtle.drawState.reset();
	clearClicked();
	Code.eraseAllGlobalVariablesAndProcedures();
	CodeEditor.restore(); // give space for the toast message to show.
	ToastMessages.success('Cleared all global variables, reset turtle and drawing', false);
}

resetAllItem.addEventListener('click', resetAll);