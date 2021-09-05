function f(resultDiv) {
	return function() {
		if (window.asyncParseTaskMessage !== '') {
			resultDiv.innerText = window.asyncParseTaskMessage;
			return;
		}
		if (window.isFailing !== false) {
			resultDiv.innerText = 'isFailing was not false.  isFailing=' + window.isFailing;
			return;
		}
		resultDiv.classList.remove('failed');
		resultDiv.classList.add('success');
		resultDiv.innerText = 'Passed';
	};
}

function test_AsyncParseTask() {
	// add script element to import module.
	var scriptElement = document.createElement('script');
	scriptElement.setAttribute('type', 'module');
	scriptElement.setAttribute('src', './compatibility/tests/asyncParseTaskTestModule.js');
	document.head.appendChild(scriptElement);
	var resultDiv = document.createElement('div');
	resultDiv.classList.add('failed');
	resultDiv.innerText = 'Waiting for asyncParseTaskTestModule';
	scriptElement.addEventListener('load', function() {
		resultDiv.innerText = 'imported module loaded';
		setTimeout(f(resultDiv), 1000);
	});
	return resultDiv;
}