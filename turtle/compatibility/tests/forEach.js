function test_forEach() {
	var a = [1,2,3];
	if (typeof a.forEach !== 'function')
		throw new Error('forEach method is not a function on an Array.');
	else {
		a.forEach(function(num, index) {
			a[index] = num * 2;
		});
		if (a[0] !== 2)
			throw new Error('a[0] is expected to be 2 but got ' + a[0]);
		if (a[1] !== 4)
			throw new Error('a[1] is expected to be 4 but got ' + a[1]);
		if (a[2] !== 6)
			throw new Error('a[2] is expected to be 6 but got ' + a[2]);
	}
}