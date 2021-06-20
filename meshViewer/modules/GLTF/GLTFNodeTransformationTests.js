function runNodeTransformationTests(addMessage) {
	const testCases = [
		{'node': {}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [1, 2, 3]},
			{'in': [-1, -2, -3], 'out': [-1, -2, -3]}
		]},
		{'node': {'translation': [1,2,3]}, 'cases': [
			{'in': [0, 0, 0], 'out': [1, 2, 3]},
			{'in': [1, 2, 3], 'out': [2, 4, 6]},
			{'in': [-1, -2, -3], 'out': [0, 0, 0]}
		]},
		{'node': {'scale': [1,2,3]}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [1, 4, 9]},
			{'in': [-1, -2, -3], 'out': [-1, -4, -9]}
		]},
		{'node': {'translation': [1, 2, 3], 'scale': [2,2,2]}, 'cases': [
			{'in': [0, 0, 0], 'out': [1, 2, 3]},
			{'in': [1, 2, 3], 'out': [3, 6, 9]},
			{'in': [-1, -2, -3], 'out': [-1, -2, -3]}
		]},
		{'node': {'matrix': [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [1, 2, 3]},
			{'in': [-1, -2, -3], 'out': [-1, -2, -3]}
		]},
		{'node': {'rotation': [1,0,0,0]}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [1, 2, 3]},
			{'in': [-1, -2, -3], 'out': [-1, -2, -3]}
		]},
		{'node': {'rotation': [0,1,0,Math.PI * 0.5]}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [3, 2, -1]},
			{'in': [-1, -2, -3], 'out': [-3, -2, 1]}
		]},
		{'node': {'rotation': [1,0,0,Math.PI * 0.5]}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [1, -3, 2]},
			{'in': [-1, -2, -3], 'out': [-1, 3, -2]}
		]},
		{'node': {'rotation': [0,0,1,Math.PI * 0.5]}, 'cases': [
			{'in': [0, 0, 0], 'out': [0, 0, 0]},
			{'in': [1, 2, 3], 'out': [-2, 1, 3]},
			{'in': [-1, -2, -3], 'out': [2, -1, -3]}
		]}
	];
	const errorThreshold = 0.0001; // allow some floating point error.
	testCases.forEach(function(nodeTestCases, nodeIndex) {
		var node = new GLTFNode(nodeTestCases.node);
		nodeTestCases.cases.forEach(function(testCase, testCaseIndex) {
			var prefix = "Node " + nodeIndex + ", test case " + testCaseIndex + ": ";
			var result = node.transform(testCase.in);
			if (typeof result !== 'object')
				addMessage(prefix + 'result expected to be an object and more specifically an Array.');
			else if (result.length !== 3)
				addMessage(prefix + 'Length of 3 expected but got ' + result.length);
			else {
				for (var i = 0; i < 3; i++) {
					if (Math.abs(result[i] - testCase.out[i]) >= errorThreshold) {
						addMessage(prefix + 'Expected ' + JSON.stringify(testCase.out) +
							' but got ' + JSON.stringify(result));
						break;
					}
				}
			}
		});
	});
}