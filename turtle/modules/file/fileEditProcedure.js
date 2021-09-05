/*
This code is dead until we update the code editor to focus on a single procedure.
*/
import { Dialog } from '../components/Dialog.js';
import { CodeEditor } from '../components/CodeEditor.js';
import { fetchText } from '../fetchText.js';

const fileEditDialogHTML = await fetchText('content/file/file-edit-procedure-dialog.html');

function showProcedureSelectDialog() {
	var selectElement;
	Dialog.show(fileEditDialogHTML, 'Procedure Selector', 300, 200, {'showCancel': true, 'okClicked': function() {
		CodeEditor.show(CodeEditor.getSourceCode(), selectElement.value);
	}});
	selectElement = document.getElementById('existing-procedure-select');
	const procs = Code.getProcedures();
	selectElement.innerHTML = '';
	procs.forEach(function(proc) {
		const option = document.createElement('option');
		option.innerText = proc.name;
		selectElement.appendChild(option);
	});
}

const fileEditProcItem = document.getElementById('file-edit-procedure');
fileEditProcItem.addEventListener('click', showProcedureSelectDialog);