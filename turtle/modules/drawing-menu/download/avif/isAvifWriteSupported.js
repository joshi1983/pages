import { getFileFormatFromArrayBuffer } from '../../../components/getFileFormatFromArrayBuffer.js';
let cachedPromise;

function createTestImageBlob() {
	const canvas = document.createElement('canvas');
	canvas.setAttribute('width', 2);
	canvas.setAttribute('height', 2);
	return new Promise(function(resolve, reject) {
		canvas.toBlob(resolve, 'image/avif');
	});
}

async function runExperiment() {
	const imageBlob = await createTestImageBlob();
	const data = imageBlob.buffer;
	const fileFormatInfo = getFileFormatFromArrayBuffer(data, 'avif');
	if (fileFormatInfo === undefined || fileFormatInfo.fileExtension !== 'avif')
		return false;
	return true;
}

export function isAvifWriteSupported() {
	if (cachedPromise === undefined) {
		cachedPromise = runExperiment();
	}
	return cachedPromise;
};