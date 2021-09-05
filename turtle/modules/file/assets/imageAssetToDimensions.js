import { base64ToArrayBuffer } from
'../../base64ToArrayBuffer.js';
import { Bitmap } from
'../../components/image-formats/Bitmap.js';
import { PCX } from
'../../components/image-formats/PCX.js';
import { PPM } from
'../../components/image-formats/PPM.js';

const mimeToConverter = new Map([
	['image/bmp', Bitmap],
	['image/x-pcx', PCX],
	['image/x-portable-pixmap', PPM]
]);

export function imageAssetToDimensions(asset) {
	const converter = mimeToConverter.get(asset.getMime());
	if (converter !== undefined) {
		return new Promise(function(resolve) {
			const arrayBuffer = base64ToArrayBuffer(asset.data);
			const byteArray = new Uint8Array(arrayBuffer);
			const meta = converter.getMeta(byteArray);
			resolve({
				'width': meta.width,
				'height': meta.height
			});
		});
	}
	const img = document.createElement('img');
	const result = new Promise(function(resolve, reject) {
		img.addEventListener('load', function() {
			resolve({
				'width': img.width,
				'height': img.height
			});
		});
	});
	img.src = asset.getBase64URI();
	return result;
};