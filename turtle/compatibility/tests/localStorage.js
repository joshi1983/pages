function test_localStorage() {
	if (typeof localStorage !== 'object')
		throw new Error('localStorage is not an object');
	if (typeof localStorage.setItem !== 'function')
		throw new Error('localStorage.setItem is not a function');
	if (typeof localStorage.getItem !== 'function')
		throw new Error('localStorage.getItem is not a function');
}