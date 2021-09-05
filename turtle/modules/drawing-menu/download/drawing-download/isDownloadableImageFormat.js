import { isAvifWriteSupported } from '../avif/isAvifWriteSupported.js';

let isAvifDownloadable = false;
isAvifWriteSupported().then(function(bool) {
	isAvifDownloadable = bool;
});

export function isDownloadableImageFormat(fileFormat) {
	if (!fileFormat.mime.startsWith('image'))
		return false;
	if (fileFormat.mime === 'image/avif' && !isAvifDownloadable)
		return false;
	if (fileFormat.name === 'PCX' || fileFormat.name === 'PPM' || fileFormat.name === 'BMP')
		return false;
	return fileFormat.mime !== 'image/gif';
	/*
	If gif was included, the raw data in the downloaded file was tested to be PNG.
	*/
};