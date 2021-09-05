export function scrapeAttributeValue(svgMarkup, attributeName) {
	const key = attributeName + '="';
	let index = svgMarkup.indexOf(key);
	if (index !== -1) {
		index += key.length;
		const endIndex = svgMarkup.indexOf('"', index);
		if (endIndex !== -1) {
			return svgMarkup.substring(index, endIndex);
		}
	}
};