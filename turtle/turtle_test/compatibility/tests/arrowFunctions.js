function test_arrowFunctions() {
	var x = (i => i * 2)(3);
	if (x !== 6)
		throw new Error('x expected to be 6 but got ' + x);
}