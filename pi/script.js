document.addEventListener('DOMContentLoaded', function() {
	var numDigits = document.getElementById('num-digits');
	var result = document.getElementById('pi-digits');
	function refreshResults() {
		result.innerText = getPi(parseInt(numDigits.value));
	}

	numDigits.addEventListener('input', refreshResults);
	refreshResults();
});