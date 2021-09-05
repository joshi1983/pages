export function getUrlBase() {
	let urlBase = document.location.href;
	if (urlBase.indexOf('test.html') !== -1) {
		const index = urlBase.indexOf('test.html');
		urlBase = urlBase.substring(0, index);
	}
	if (!urlBase.endsWith('/'))
		urlBase += '/';
	return urlBase;
};