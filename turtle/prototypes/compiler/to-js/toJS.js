import { ready } from
'../../../modules/ready.js';
import { refreshLineNumbers } from '../../helpers/refreshLineNumbers.js';
import { translateWebLogoToJS } from
'../../../modules/parsing/compiling/to-js/translateWebLogoToJS.js';

let lineNumbersContainer, input, output;
let optionNameChooser;

const options = [
	{	'name': 'Module',
		'object': {
			'type': 'module'
		}
	},
	{
		'name': 'Shader Worker',
		'object': {
			'type': 'shader'
		}
	}
];

function refreshLineNumbers_() {
	const code = input.value;
	refreshLineNumbers(lineNumbersContainer, code);
}

function refreshOutputs() {
	refreshLineNumbers_();
	const name = optionNameChooser.value;
	const matchedOptions = options.filter(o => o.name === name)[0];
	let optionsClone = {};
	if (matchedOptions !== undefined) {
		optionsClone = Object.assign({}, matchedOptions.object);
	}
	const translated = translateWebLogoToJS(input.value, optionsClone);
	output.innerText = translated;
}

function init() {
	input = document.getElementById('input');
	output = document.getElementById('js-output');
	lineNumbersContainer = document.getElementById('code-input-line-numbers');
	optionNameChooser = document.getElementById('options');
	for (const option of options) {
		const optionElement = document.createElement('option');
		optionElement.value = option.name;
		optionElement.innerText = option.name;
		optionNameChooser.appendChild(optionElement);
	}
	optionNameChooser.addEventListener('change', refreshOutputs);
	input.addEventListener('input', refreshOutputs);
	refreshOutputs();
}

ready(init);