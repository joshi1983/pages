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
	container.appendChild(createDivForNameValuePair('App Code Name', navigator.appCodeName));
	container.appendChild(createDivForNameValuePair('App Version', navigator.appVersion));
	container.appendChild(createDivForNameValuePair('User Agent', navigator.userAgent));
	container.appendChild(createDivForNameValuePair('Platform', navigator.platform));
}

function init() {
	updateBrowserVersionInfo();
	runTests();
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();