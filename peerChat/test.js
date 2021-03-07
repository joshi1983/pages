document.addEventListener('DOMContentLoaded', function() {
	var results = document.getElementById('test-results');

	function reportResult(unitName, msg, isPassed) {
		var div = document.createElement('div');
		div.classList.add(isPassed ? 'passed' : 'failed');
		var unitNameElement = document.createElement('div');
		unitNameElement.innerText = unitName;
		unitNameElement.classList.add('unit-name');
		var msgElement = document.createElement('div');
		msgElement.classList.add('msg');
		msgElement.innerText = msg;
		div.appendChild(unitNameElement);
		div.appendChild(msgElement);
		results.appendChild(div);
	}

	function testArraysAreDifferent() {
		var testCases = [
			{'in': [[], []], 'out': false},
			{'in': [[0], [0]], 'out': false},
			{'in': [[0, 1], [0, 1]], 'out': false},
			{'in': [[0], []], 'out': true},
			{'in': [[], [0]], 'out': true},
			{'in': [[0], [1]], 'out': true},
			{'in': [[0, 1], [1, 0]], 'out': true}
		];
		testCases.forEach(function(testCase) {
			var result = arraysAreDifferent(testCase.in[0], testCase.in[1]);
			if (result !== testCase.out) {
				reportResult('arraysAreDifferent', 'Expected ' + testCase.out + ' but got ' + result, false);
			}
			else {
				reportResult('arraysAreDifferent', 'Expected ' + testCase.out + ' and got ' + result, true);
			}
		});
	}

	testArraysAreDifferent();
});