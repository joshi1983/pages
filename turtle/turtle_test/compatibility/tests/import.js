function test_import() {
	var scriptElement = document.createElement('script');
	scriptElement.setAttribute('type', 'module');
	scriptElement.setAttribute('src', 'tests/importTestModule.js');
	document.head.appendChild(scriptElement);
	var result = document.createElement('div');
	result.classList.add('failed');
	result.innerText = 'Imported module pending...';
	scriptElement.addEventListener('load', function() {
		if (window.importTestModuleValue !== 123) {
			result.innerText = 'Expected importTestModuleValue to be 123 but got ' + window.importTestModuleValue;
			return;
		}
		result.classList.remove('failed');
		result.classList.add('passed');
		result.innerText = 'Passed';
	});
	return result;
}