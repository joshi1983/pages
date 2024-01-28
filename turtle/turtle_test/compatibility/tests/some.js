function test_some() {
	var a = [1, 2, 3];
	if (typeof a.some !== 'function')
		throw new Error('No method named some in Array');
	else {
		var someResult = a.some(function(e) {return e === 2;});
		if (someResult !== true)
			throw new Error('Expected someResult to be true but got ' + someResult);
		someResult = a.some(function(e) {return e === 9;});;
		if (someResult !== false)
			throw new Error('Expected someResult to be false but got ' + someResult);
	}
}