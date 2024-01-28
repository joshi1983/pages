function test_fetch() {
	if (typeof fetch !== 'function')
		throw new Error('fetch is not a function.  typeof fetch=' + (typeof fetch));
	var resultDiv = document.createElement('div');
	resultDiv.classList.add('failed');
	fetch('tests/fetch.js').then(function(result) {
		resultDiv.classList.remove('failed');
		resultDiv.classList.add('passed');
		resultDiv.innerText = 'Passed';
	}).catch(function(e) {
		resultDiv.innerText = 'catch called. e='+e;
	});
	return resultDiv;
}