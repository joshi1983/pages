import { Code } from '../components/code-editor/Code.js';
import { CodeEditor } from '../components/CodeEditor.js';
import { ToastMessages } from '../components/ToastMessages.js';

function fileNewClicked() {
	Code.setSourceCode('');
	CodeEditor.textElement.setValue('');
	ToastMessages.success('The code has been emptied.', false);
}

const fileNewItem = document.getElementById('file-new');
fileNewItem.addEventListener('click', fileNewClicked);