import { blobToArrayBuffer } from
'../../../../modules/blobToArrayBuffer.js';
import { fetchBlob } from
'../../../../modules/fetchBlob.js';
import { getPaletteColours } from
'../../../../modules/components/image-formats/amiga-iff/getPaletteColours.js';

export async function testGetPaletteColours(logger) {
	const url = 'tests/data/image-formats/amiga-iff/2-by-2-black-white-red-blue.iff';
	const arrayBuffer = await blobToArrayBuffer(await fetchBlob(url));
	const colours = getPaletteColours(new Uint8Array(arrayBuffer));
	if (!(colours instanceof Array))
		logger(`Array expected but found ${colours}`);
};