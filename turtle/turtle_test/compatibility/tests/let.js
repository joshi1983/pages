function test_let() {
	let x = 4;
	if (x !== 4)
		throw new Error('x expected to be 4 but got ' + x);
}