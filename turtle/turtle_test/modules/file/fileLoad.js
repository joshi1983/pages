import { Code } from '../components/code-editor/Code.js';
import { CodeEditor } from '../components/CodeEditor.js';
import { EventQueue } from '../components/EventQueue.js';
import { ToastMessages } from '../components/ToastMessages.js';

function fileLoadItemClicked() {
	const fileSelector = document.createElement('input');
	fileSelector.setAttribute('type', 'file');
	fileSelector.setAttribute('accept', '.lgo');
	fileSelector.addEventListener('input', function() {
		const file = fileSelector.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (evt) {
				Code.setFileName(file.name);
				Code.setSourceCode(evt.target.result);
				EventQueue.addEvent({'type': 'paste'});
				// indicate code loaded into editor like it would if it was pasted in.

				ToastMessages.success(file.name + ' loaded!', false);
				setTimeout(function() {
					CodeEditor.show();
				}, 0);
			};
			reader.readAsText(file, "UTF-8");
		}
	});
	fileSelector.click();
}

const fileLoadItem = document.getElementById('file-load');
fileLoadItem.addEventListener('click', fileLoadItemClicked);
