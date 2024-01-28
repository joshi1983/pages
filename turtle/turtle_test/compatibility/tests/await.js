function test_await() {
	async function asyncFunc1() {
		return 654;
	}
	async function asyncFunc2() {
		var result2 = await asyncFunc1();
		return result2;
	}
	var resultDiv = document.createElement('div');
	resultDiv.classList.add('failed');
	resultDiv.innerText = 'Pending asyncFunc then';
	var result = asyncFunc2();
	if (typeof result !== 'object')
		throw new Error('result from asyncFunc2() expected to be an object but got ' + result);
	if (typeof result.then !== 'function')
		throw new Error('result from asyncFunc2().then expected to be a function but got ' + typeof result.then);
	asyncFunc2().then(function(result_) {
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