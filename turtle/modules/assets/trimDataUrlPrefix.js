export function trimDataUrlPrefix(dataUrl) {
	const substring = 'base64,';
	const index = dataUrl.indexOf(substring);
	if (index === -1 || index > 50)
		return dataUrl;
	else
		return dataUrl.substring(index + substring.length);
};