import { Code } from './Code.js';
import { CodeEditor } from './CodeEditor.js';
import { ToastMessages } from '../ToastMessages.js';
const resetGlobalVariablesItem = document.getElementById('editor-reset-global-variables');

function resetGlobalVariables() {
	Code.eraseAllGlobalVariablesAndProcedures();
	CodeEditor.restore(); // give space for the toast message to show.
	ToastMessages.success('Cleared all global variables', false);
}

resetGlobalVariablesItem.addEventListener('click', resetGlobalVariables);