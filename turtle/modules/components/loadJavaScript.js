const promiseMap = new Map();

function getPromiseFor(url) {
	if (typeof url !== 'string')
		throw new Error(`url must be a string but got ${url}`);

	const scriptElement = document.createElement('script');
	return new Promise(function(resolve, reject) {
		scriptElement.addEventListener('load', function() {
			resolve();
		});
		scriptElement.setAttribute('src', url);
		let container;
		if (document.head !== null)
			container = document.head;
		else if (document.body !== null)
			container = document.body;
		else
			container = document;
		container.appendChild(scriptElement);
	});
}

export function loadJavaScript(url) {
	if (false === promiseMap.has(url)) {
		promiseMap.set(url, getPromiseFor(url));
	}
	return promiseMap.get(url);
};