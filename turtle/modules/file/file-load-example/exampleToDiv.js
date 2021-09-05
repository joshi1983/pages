import { Code } from '../../components/code-editor/Code.js';
import { CodeEditor } from '../../components/CodeEditor.js';
import { Dialog } from '../../components/Dialog.js';
import { exampleToDivCustomClick } from './exampleToDivCustomClick.js';
import { fetchText } from '../../fetchText.js';
import { ToastMessages } from '../../components/ToastMessages.js';

function loadExample(exampleInfo) {
	const url = 'logo-scripts/' + exampleInfo.filename;
	fetchText(url).then(function(text) {
		Code.setSourceCode(text);
		ToastMessages.success(exampleInfo.name + ' loaded!', false);
		Dialog.hide();
		CodeEditor.show();
	});
}

export function exampleToDiv(example) {
	return exampleToDivCustomClick(example, function() {
		loadExample(example);
	});
};