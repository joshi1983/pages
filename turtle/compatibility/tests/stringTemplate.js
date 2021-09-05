function test_stringTemplate() {
	var expected = 'hello World';
	var x = `${expected}`;
	if (x !== expected)
		throw new Error('Expected x to be ' + expected + ' but got ' + x);
}