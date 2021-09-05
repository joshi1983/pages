function test_MapClass() {
	if (typeof Map !== 'function')
		throw new Error('Map expected to be a function but typeof Map of ' + typeof Map);
	var m = new Map([['x', 3], ['y', 5]]);
	if (m.size !== 2)
		throw new Error('size expected to be 2 but got ' + m.size);
	if (m.get('x') !== 3)
		throw new Error('Value of x expected to be 3 but got ' + m.get('x'));
	if (m.get('y') !== 5)
		throw new Error('Value of y expected to be 5 but got ' + m.get('y'));
}