function test_Promise() {
	if (typeof Promise !== 'function')
		throw new Error('Promise expected to be a function but got something else');
	else {
		var p = new Promise(function(resolve, reject) {
			resolve();
		});
		if (typeof p.then !== 'function')
			throw new Error('A Promise object\'s then property expected to be a function but got ' + typeof p.then);
		var isThenCalledImmediately = false;
		var result = document.createElement('div');
		result.classList.add('failed');
		result.innerText = 'Promise pending...';
		p.then(function() {
			result.classList.remove('failed');
			result.classList.add('passed');
			result.innerText = 'Passed';
		});
		return result;
	}
}