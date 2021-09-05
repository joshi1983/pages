import { base64ToArrayBuffer } from
'../base64ToArrayBuffer.js';
import { PCX } from '../components/image-formats/PCX.js';

export async function pcxDataToImageDataUrl(data) {
	if (typeof data !== 'string')
		throw new Error(`data must be a string, the base-64-encoded data of a PCX document but found ${data}`);
	if (data.indexOf(';') !== -1)
		throw new Error(`data must not contain ;.  It must not encode any MIME types.  data found to be ${data}`);

	const arrayBuffer = base64ToArrayBuffer(data);
	if (!(arrayBuffer instanceof ArrayBuffer))
		throw new Error(`ArrayBuffer expected but found ${arrayBuffer}`);
	const imageBitmap = await PCX.arrayBufferToImageBitmap(arrayBuffer);
	const canvas = document.createElement('canvas');
	canvas.width = imageBitmap.width;
	canvas.height = imageBitmap.height;
	const ctx = canvas.getContext('bitmaprenderer');
	ctx.transferFromImageBitmap(imageBitmap);
	return canvas.toDataURL('image/png');
};