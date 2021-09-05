const substringsToRemove = ['?', 'test.html', 'index.html'];

export function getUrlBase() {
	let urlBase = document.location.href;
	for (const substring of substringsToRemove) {
		const index = urlBase.indexOf(substring);
		if (index !== -1)
			urlBase = urlBase.substring(0, index);
	}
	if (!urlBase.endsWith('/'))
		urlBase += '/';
	return urlBase;
};