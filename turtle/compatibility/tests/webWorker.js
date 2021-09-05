function test_webWorker() {
	if (typeof Worker !== 'function')
		throw new Error('Worker expected to be a function but typeof returned ' + typeof Worker);
	var resultDiv = document.createElement('div');
	resultDiv.classList.add('failed');
	resultDiv.innerText = 'Pending result from worker...';
	worker = new Worker("./compatibility/tripleWorker.js");
	worker.onmessage = function(result) {
		if (result.data === 15) {
			resultDiv.classList.remove('failed');
			resultDiv.classList.add('passed');
			resultDiv.innerText = 'Passed';
		}
	};
	worker.postMessage(5);
	return resultDiv;
}