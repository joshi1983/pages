import { base64ToArrayBuffer } from
'../../base64ToArrayBuffer.js';
import { PCX } from
'../../components/image-formats/PCX.js';

export function imageAssetToDimensions(asset) {
	if (asset.getMime() === 'image/x-pcx') {
		return new Promise(function(resolve) {
			const arrayBuffer = base64ToArrayBuffer(asset.data);
			const byteArray = new Uint8Array(arrayBuffer);
			const meta = PCX.getMeta(byteArray);
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