export function scrapeAttributeValue(svgMarkup, attributeName) {
	const key = ' ' + attributeName + '="';
	let index = svgMarkup.indexOf(key);
	if (index === -1) {
		if (attributeName === 'x' || attributeName === 'y')
			return 0;
	}
	else if (index !== -1) {
		index += key.length;
		const endIndex = svgMarkup.indexOf('"', index);
		if (endIndex !== -1) {
			return svgMarkup.substring(index, endIndex);
		}
	}
};