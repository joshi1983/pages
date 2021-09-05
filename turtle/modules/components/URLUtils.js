function upDirectory(url) {
	let index = url.lastIndexOf('/');
	if (index === 1 && url.startsWith('./'))
		return '';
	if (index !== -1)
		return url.substring(0, index);
	return '';
}

export class URLUtils {
	static computeRelativeURL(startURL, relativeURL) {
		if (startURL.indexOf('/') !== -1)
			startURL = upDirectory(startURL);
		else
			startURL = '';
		while (startURL.startsWith('./'))
			startURL = startURL.substring(2);
		let continueProcessing = true;
		while (continueProcessing) {
			continueProcessing = false;
			if (relativeURL.startsWith('../')) {
				startURL = upDirectory(startURL);
				relativeURL = relativeURL.substring('../'.length);
				continueProcessing = true;
			}
			if (relativeURL.startsWith('./')) {
				relativeURL = relativeURL.substring('./'.length);
				continueProcessing = true;
			}
		}
		if (startURL === '')
			return relativeURL;
		else
			return startURL + '/' + relativeURL;
	}
};