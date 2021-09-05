function test_map() {
	var a = [1,2,3];
	if (typeof a.map !== 'function')
		throw new Error('map method is not a function on an Array.');
	else {
		var b = a.map(function(num) {
			return num * 2;
		});
		if (b[0] !== 2)
			throw new Error('b[0] is expected to be 2 but got ' + b[0]);
		if (b[1] !== 4)
			throw new Error('b[1] is expected to be 4 but got ' + b[1]);
		if (b[2] !== 6)
			throw new Error('b[2] is expected to be 6 but got ' + b[2]);
	}
}