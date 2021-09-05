export function formatGifFilename(prefix) {
	const index = prefix.lastIndexOf('.');
	if (index !== -1 && index > prefix.length - 6)
		prefix = prefix.substring(0, index);
	return prefix + '.gif';
};