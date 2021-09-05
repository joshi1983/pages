import { Code } from '../../components/code-editor/Code.js';
import { CodeEditor } from '../../components/CodeEditor.js';
import { Dialog } from '../../components/Dialog.js';
import { fetchText } from '../../fetchText.js';
import { ScriptExampleDisplayRepository } from './ScriptExampleDisplayRepository.js';
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
	const result = document.createElement('div');
	const topDiv = document.createElement('div');
	topDiv.classList.add('top-row');
	const name = document.createElement('div');
	name.classList.add('name');
	name.innerText = example.name;
	result.setAttribute('title', 'Click to load "' + example.name + '"');
	result.classList.add('clickable');
	// so the full name is visible while hovering even if it gets cut short in the name element.
	const keywords = document.createElement('div');
	keywords.classList.add('keywords');
	example.searchKeywords.forEach(function(keyword) {
		const span = document.createElement('span');
		span.innerText = keyword;
		keywords.appendChild(span);
	});
	topDiv.appendChild(name);
	topDiv.appendChild(keywords);
	result.addEventListener('click', function() {
		loadExample(example);
	});
	const displayDiv = ScriptExampleDisplayRepository.get(example.filename).div;
	result.appendChild(topDiv);
	result.appendChild(displayDiv);
	return result;
};