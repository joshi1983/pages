import { addTwo } from './module1.js';

let input;
let output;

function refreshCalculated() {
	const num = parseFloat(input.value);
	output.innerText = addTwo(num);
}

function init() {
	input = document.getElementById('val');
	output = document.getElementById('calculated');
	input.addEventListener('input', refreshCalculated);
	refreshCalculated();
}

if (document.status === 'ready')
	init();
else
	document.addEventListener('DOMContentLoaded', init);
