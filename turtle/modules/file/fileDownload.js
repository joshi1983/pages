import { ToastMessages } from '../components/ToastMessages.js';
import { Code } from '../components/code-editor/Code.js';
import { CodeEditor } from '../components/CodeEditor.js';

function fileDownloadClicked() {
	const blob = new Blob([CodeEditor.getSourceCode()], { 'type': 'text/plain' });
	const dataURL = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.setAttribute('download', Code.getFileName());
	a.setAttribute('href', dataURL);
	a.click();
	ToastMessages.success('Source code has been downloaded with a name similar to ' + Code.getFileName(), false);
}

const fileDownloadItem = document.getElementById('file-download');
fileDownloadItem.addEventListener('click', fileDownloadClicked);