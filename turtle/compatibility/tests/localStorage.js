function test_localStorage() {
	if (typeof localStorage !== 'object')
		throw new Error('localStorage is not an object');
	if (typeof localStorage.setItem !== 'function')
		throw new Error('localStorage.setItem is not a function');
	if (typeof localStorage.getItem !== 'function')
		throw new Error('localStorage.getItem is not a function');
	localStorage.setItem('x', '1');
	var val = localStorage.getItem('x');
	if (val !== '1')
		throw new Error('Expected to read value for item x as 1 but got ' + val);
	localStorage.removeItem('x');
	val = localStorage.getItem('x');
	if (val !== null)
		throw new Error('Expected to read value for item x as null but got ' + val);
}