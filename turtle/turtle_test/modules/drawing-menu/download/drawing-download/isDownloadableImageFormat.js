export function isDownloadableImageFormat(fileFormat) {
	return fileFormat.mime.startsWith('image') &&
		fileFormat.mime !== 'image/gif';
	/*
	If gif was included, the raw data in the downloaded file was tested to be PNG.
	*/
};