function zeroPad(i, padCount) {
	let result = '' + i;
	while (result.length < padCount)
		result = '0' + result;
	return result;
}

export function formatFilename(prefix, frameIndex, extension) {
	if (typeof prefix !== 'string')
		throw new Error('prefix must be a string.  Not: ' + prefix);
	if (typeof frameIndex !== 'number')
		throw new Error('frameIndex must be a number.  Not: ' + frameIndex);
	if (typeof extension !== 'string')
		throw new Error('extension must be a string.  Not: ' + extension);

	if (extension.charAt(0) !== '.')
		extension = '.' + extension;

	return prefix + zeroPad(frameIndex, 8) + extension;
};