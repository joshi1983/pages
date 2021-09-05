import { blobToArrayBuffer } from '../../../../blobToArrayBuffer.js';
import { FileExtensions } from '../../../../drawing-menu/download/FileExtensions.js';
import { getFileFormatFromArrayBuffer } from '../../../getFileFormatFromArrayBuffer.js';
import { StringUtils } from '../../../../StringUtils.js';

function findNameNotTaken(s, takenNames) {
	if (!takenNames.has(s))
		return s;
	const extension = FileExtensions.getFileExtensionFromFilename(s);
	const mainName = s.substring(0, s.length - extension.length - 1);
	let result;
	for (let i = 1; i === 1 || takenNames.has(result); i++) {
		result = `${mainName}${i}.${extension}`;
	}
	return result;
}

function getLongestDomainNamePart(url) {
	let index = url.indexOf('/');
	if (index !== -1)
		url = url.substring(0, index);
	let result = '';
	while (url !== '') {
		index = url.indexOf('.');
		if (index === -1) {
			if (url.length > result)
				result = url;
			break;
		}
		else {
			const s = url.substring(0, index);
			if (s.length > result.length)
				result = s;
			url = url.substring(index + 1);
		}
	}
	return result;
}

function removeProtocol(url) {
	let index = url.indexOf('://');
	if (index !== -1)
		url = url.substring(index + 3);
	return url;
}

export async function getAssetFileName(url, blob, takenNames) {
	if (!(takenNames instanceof Set))
		throw new Error(`takenNames must be a Set but got ${takenNames}`);
	url = removeProtocol(url);
	const index = url.lastIndexOf('/');
	let result;
	if (index !== -1)
		result = url.substring(index + 1);
	else
		result = getLongestDomainNamePart(url);
	const arrayBuffer = await blobToArrayBuffer(blob);
	let hintedExtension = FileExtensions.getFileExtensionFromFilename(result);
	if (hintedExtension === undefined)
		hintedExtension = 'dat';
	const fileExtension = getFileFormatFromArrayBuffer(arrayBuffer, hintedExtension);
	if (fileExtension !== undefined)
		result = StringUtils.forceFileExtension(result, fileExtension);
	result = findNameNotTaken(result, takenNames);
	return result;
};