export function validateAlternativeLinks(fullInfoObject, logger) {
	if (fullInfoObject.alternativeLinks !== undefined) {
		if (!(fullInfoObject.alternativeLinks instanceof Array))
			logger(`Expected alternativeLinks to either be undefined or be an Array but got ${fullInfoObject.alternativeLinks}`);
		else {
			fullInfoObject.alternativeLinks.forEach(function(url) {
				if (typeof url !== 'string')
					logger(`Expected every alternativeLinks element to be a string but found ${url}`);
				else {
					if (!url.startsWith('http://') && !url.startsWith('https://'))
						logger(`A alternativeLinks URL should start with either http:// or https:// but found ${url}`);
				}
			});
		}
	}
};