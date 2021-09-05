function test_async() {
	async function asyncFunc() {
		return 654;
	}
	var resultDiv = document.createElement('div');
	resultDiv.classList.add('failed');
	resultDiv.innerText = 'Pending asyncFunc then';
	var result = asyncFunc();
	if (typeof result !== 'object')
		throw new Error('result from asyncFunc() expected to be an object but got ' + result);
	if (typeof result.then !== 'function')
		throw new Error('result from asyncFunc().then expected to be a function but got ' + typeof result.then);
	asyncFunc().then(function(result_) {
		if (result_ !== 654)
			resultDiv.innerText = 'Expected 654 but got ' + result_;
		else {
			resultDiv.classList.remove('failed');
			resultDiv.classList.add('passed');
			resultDiv.innerText = 'Passed';
		}
	});
	return resultDiv;
}