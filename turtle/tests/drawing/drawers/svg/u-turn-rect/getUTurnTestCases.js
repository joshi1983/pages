
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
	{
			'elementsInfo': {
				'code': `right 10\nroundRect 50 100 25`,
				'pathIndex': -1 // last index
			},
			'width': 50,
			'height': 100,
			'rx': 25,
			'out': true
		},
	{
			'elementsInfo': {
				'code': `right 90\nroundRect 50 100 25`,
				'pathIndex': -1 // last index
			},
			'width': 50,
			'height': 100,
			'rx': 25,
			'out': true
		},
	{
			'elementsInfo': {
				'code': `make "radius 100
make "arcAngle 70
polyStart
arcRight :arcAngle :radius
right 180 - :arcAngle
arcRight :arcAngle :radius
polyEnd`,
				'pathIndex': -1 // last index
			},
			'out': false
		},
	];
	return cases;
};