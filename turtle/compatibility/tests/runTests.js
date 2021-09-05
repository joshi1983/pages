var tests = [
'arrowFunctions',
'async',
'AsyncParseTask',
'await',
'avifRead',
'const',
'fetch',
'forEach',
'import',
'let',
'localStorage',
'map',
'MapClass',
'Promise',
'Set',
'some',
'staticBlock',
'stringTemplate',
'webWorker'];

function addScript(url) {
	var head = document.head;
	var scriptElement = document.createElement('script');
	scriptElement.setAttribute('src', url);
	head.appendChild(scriptElement);
	return scriptElement;
}

function runTest(name) {
	var msg = '';
	var resultDiv = document.createElement('div');
	resultDiv.classList.add('test-result');
	var label = document.createElement('label');
	label.innerText = name;
	resultDiv.appendChild(label);
	var msgElement = document.createElement('div');
	if (typeof window[name] !== 'function')
		msg = 'No function named ' + name;
	else {
		try {
			var result = window[name]();
			if (result !== undefined)
				msgElement = result;
		}
		catch (e) {
			if (typeof e === 'string')
				msg = e;
			else if (typeof e.message === 'string')
				msg = 'Error: ' + e.message;
			else
				msg = 'Error: ' + e;
		}
	}
	var isPassed = msg === '';
	if (isPassed) {
		msgElement.innerText = 'Passed';
		msgElement.classList.add('passed');
	}
	else {
		msgElement.innerText = msg;
		msgElement.classList.add('failed');
	}
	resultDiv.appendChild(msgElement);
	return resultDiv;
}

function runTests() {
	var testResultsContainer = document.getElementById('test-results');
	var prefix = 'compatibility/tests/';
	var i;
	var name;
	var url;
	for (i = 0; i < tests.length; i++) {
		name = tests[i];
		url = prefix + name + '.js';
		addScript(url).addEventListener('load', function() {
			var name = this.getAttribute('src').substring(prefix.length);
			name = name.substring(0, name.length - 3);
			name = 'test_' + name;
			var resultDiv = runTest(name);
			testResultsContainer.appendChild(resultDiv);
		});
	}
}