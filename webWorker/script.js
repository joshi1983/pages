document.addEventListener('DOMContentLoaded', function() {
	var number1 = document.getElementById('number-1');
	var number2 = document.getElementById('number-2');
	var result = document.getElementById('result');
	var w = new Worker('sumWorker.js');
	w.onmessage = function(sumResult) {
		result.innerText = sumResult.data;
	};
	w.postMessage({'num1': 1, 'num2': 2});

	function inputsUpdated() {
		w.postMessage({'num1': parseFloat(number1.value), 'num2': parseFloat(number2.value)});
	}

	number1.addEventListener('input', inputsUpdated);
	number2.addEventListener('input', inputsUpdated);
	inputsUpdated();
});