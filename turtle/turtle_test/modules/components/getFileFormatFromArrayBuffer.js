import { ArrayUtils } from '../ArrayUtils.js';
import { fetchJson } from '../fetchJson.js';
import { FileExtensions } from '../drawing-menu/download/FileExtensions.js';
import { StringBuffer } from '../StringBuffer.js';
const fileFormats = await fetchJson('json/fileExtensions.json');

const textSubstrings = new Map([
	['svg', '"http://www.w3.org/2000/svg"'],
]);

/*
These pairs represent cases where 2 possibilities can be reduced to 1(the left side format).
*/
const preferencePairs = [
	['html', 'svg'] // The data likely corresponds to an HTML file with embedded SVG.
];

function mayBeMp3(data) {
	if (data.length > 2 && data[0] === 255 && data[1] === 251)
		return true;
	else
		return data.length > 3 && data[0] === 73 && data[1] === 68 && data[2] === 51;
}

function mayBeHTML(contentString) {
	contentString = contentString.toLowerCase();
	if (contentString.indexOf('<html') !== -1 && contentString.indexOf('</html>') !== -1)
		return true;

	return false;
}

function matchesSignatureCheck(checkInfo, data) {
	if (data.byteLength < checkInfo[0] + checkInfo[1].length)
		return false;
	for (let i = 0; i < checkInfo[1].length; i++) {
		if (data[checkInfo[0] + i] !== checkInfo[1][i])
			return false;
	}
	return true;
}

function byteArrayToString(data) {
	const result = new StringBuffer();
	for (var i=0; i < data.byteLength; i++) {
		result.append(String.fromCharCode(data[i]));
	}
	return result.toString();
}

function isPossibleFormatForData(format, data) {
	if (format.fileExtension === 'mp3')
		return mayBeMp3(data);
	const checks = format.rawDataSignature;
	for (let i = 0; i < checks.length; i++) {
		if (!matchesSignatureCheck(checks[i], data))
			return false;
	}
	if (textSubstrings.has(format.fileExtension) || format.fileExtension === 'html') {
		data = byteArrayToString(data);
		if (format.fileExtension === 'html')
			return mayBeHTML(data);
		return data.indexOf(textSubstrings.get(format.fileExtension)) !== -1;
	}
	return true;
}

function getPossibleFormats(data) {
	return fileFormats.filter(function(format) {
		return isPossibleFormatForData(format, data);
	});
}

function processPreferencePairs(possibleFormats) {
	if (possibleFormats.length <= 1)
		return; // no reduction possible so stop immediately.
	const toRemove = new Set();
	for (let i = 0; i < preferencePairs.length; i++) {
		const pair = preferencePairs[i];
		if (possibleFormats.some(f => f.fileExtension === pair[0]) &&
		possibleFormats.some(f => f.fileExtension === pair[1])) {
			toRemove.add(possibleFormats.filter(f => f.fileExtension === pair[1])[0]);
		}
	}
	ArrayUtils.remove(possibleFormats, f => !toRemove.has(f));
}

/*
If a format is recognized, its information from json/fileExtensions.json is returned.

drawing-menu/download/FileFormats.js is also closely related to json/fileExtensions.json.
*/
export function getFileFormatFromArrayBuffer(data, hintedExtension) {
	if (typeof hintedExtension !== 'string')
		throw new Error(`hintedExtension must be a string but got ${hintedExtension}`);
	hintedExtension = hintedExtension.toLowerCase();
	data = new Uint8Array( data );

	const possibleFormats = getPossibleFormats(data);

	// if the hintedExtension matches one of the possible formats, return the hintedExtension.
	if (possibleFormats.some(f => FileExtensions.matchesFileExtension(f, hintedExtension)))
		return hintedExtension;

	processPreferencePairs(possibleFormats);

	// if only 1 possible format was found, return it.
	if (possibleFormats.length === 1)
		return possibleFormats[0].fileExtension;

	// if the hintedExtension matches one of the impossible formats, return undefined.
	if (fileFormats.some(f => FileExtensions.matchesFileExtension(f, hintedExtension)))
		return undefined;
	return hintedExtension;
};