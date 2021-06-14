document.addEventListener('DOMContentLoaded', function() {
	var testResults = document.getElementById('test-results');
	var smokeTestCases = [
		{},
		{'name': 'Bob'},
		{'translation': [0,0,0]},
		{'scale': [0,0,0]},
		{'scale': [1,1,1]},
		{'rotation': [1,0,0,0]},
		{'rotation': [1,0,0,1]},
		{'matrix': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},
	];
	smokeTestCases.forEach(function(testCase) {
		new GLTFNode(testCase);
	});
	function addMessage(msg) {
		var e = document.createElement('div');
		e.innerText = msg;
		testResults.appendChild(e);
	}

	runNodeTransformationTests(addMessage);
	runAccessorTests(addMessage);
});