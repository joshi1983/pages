import { ready } from
'../../../modules/ready.js';
import { refreshLineNumbers } from '../../helpers/refreshLineNumbers.js';
import { translateWebLogoToJS } from
'../../../modules/parsing/compiling/to-js/translateWebLogoToJS.js';

let lineNumbersContainer, input;

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

function init() {
	input = document.getElementById('input');
	const output = document.getElementById('js-output');
	lineNumbersContainer = document.getElementById('code-input-line-numbers');;
	input.addEventListener('input', function() {
		refreshLineNumbers_();
		const translated = translateWebLogoToJS(input.value);
		output.innerText = translated;
	});
}

ready(init);