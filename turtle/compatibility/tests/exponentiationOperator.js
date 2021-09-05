function test_exponentiationOperator() {
	var result = 2 ** 3;
	if (result !== 8)
		throw new Error('** test failed.  Expected 8 but got ' + result);
}