function createDivForNameValuePair(name, value) {
	var container = document.createElement('div');
	container.classList.add('name-value-pair');
	var label = document.createElement('label');
	label.innerText = name;
	container.appendChild(label);
	var valueDiv = document.createElement('div');
	valueDiv.classList.add('value');
	valueDiv.appendChild(document.createTextNode('' + value));
	container.appendChild(valueDiv);
	return container;
}

function updateBrowserVersionInfo() {
	var container = document.getElementById('browser-version');
	var namePropPairs = [
		['App Code Name', 'appCodeName'],
		['App Version', 'appVersion'],
		['User Agent', 'userAgent'],
		['Platform', 'platform'],
		['Device Memory', 'deviceMemory'],
		['Logical CPU Core Count', 'hardwareConcurrency']
	];
	var pair;
	for (let i = 0; i < namePropPairs.length; i++) {
		pair = namePropPairs[i];
		container.appendChild(createDivForNameValuePair(pair[0], navigator[pair[1]]));
	}
}

function init() {
	updateBrowserVersionInfo();
	runTests();
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();