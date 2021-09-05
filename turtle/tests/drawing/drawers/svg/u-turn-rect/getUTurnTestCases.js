
export function getUTurnTestCases() {
	const cases = [
	{
			'elementsInfo': {
				'code': `roundRect 50 100 25`,
				'pathIndex': -1 // last index
			},
			'width': 50,
			'height': 100,
			'rx': 25,
			'out': true
		},
	];
	return cases;
};