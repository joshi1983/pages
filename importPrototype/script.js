import { sum } from './sum.js'

document.addEventListener('DOMContentLoaded', function() {
	var number1 = document.getElementById('number-1');
	var number2 = document.getElementById('number-2');
	var result = document.getElementById('result');

	function inputsUpdated() {
		if (typeof sum === 'function') {
			result.innerText = sum(parseFloat(number1.value), parseFloat(number2.value));
		}
	}

	number1.addEventListener('input', inputsUpdated);
	number2.addEventListener('input', inputsUpdated);
	inputsUpdated();
});