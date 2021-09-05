function test_Set() {
	if (typeof Set !== 'function')
		throw new Error('Set is not a function.');
	var s = new Set([1, 2, 3]);
	if (s.has(1) !== true)
		throw new Error('Expected s to contain 1 but has returned ' + s.has(1));
	if (s.has(2) !== true)
		throw new Error('Expected s to contain 2 but has returned ' + s.has(2));
	if (s.has(10) === true)
		throw new Error('Expected s to not contain 10 but has returned ' + s.has(10));
}