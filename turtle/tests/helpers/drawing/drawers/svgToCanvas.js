/*
Returns a Promise which resolves to a canvas element.
*/
export function svgToCanvas(svgText, width, height) {
	if (typeof svgText !== 'string')
		throw new Error(`svgText must be a string.  Not: ${svgText}`);
	if (!Number.isInteger(width))
		throw new Error(`width must be an integer.  Not: ${width}`);
	if (!Number.isInteger(height))
		throw new Error(`height must be an integer.  Not: ${height}`);
	const result = document.createElement('canvas');
	result.setAttribute('width', width);
	result.setAttribute('height', height);
	const context = result.getContext('2d');
	const image = document.createElement('img');
	return new Promise(function(resolve, reject) {
		image.addEventListener('load', function() {
			context.drawImage(image, 0, 0, width, height);
			resolve(result);
		});
		image.setAttribute('src', 'data:image/svg+xml;base64,'+btoa(svgText));
	});
};