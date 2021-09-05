import { blobToBase64 } from '../modules/blobToBase64.js';
import { fetchBlob } from '../modules/fetchBlob.js';

export async function testBlobToBase64(logger) {
	const blob = await fetchBlob('images/logo-32px.png');
	const result = await blobToBase64(blob);
	if (typeof result !== 'string')
		logger(`Expected a string but ${result}`);
};