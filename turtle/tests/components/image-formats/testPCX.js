import { blobToArrayBuffer } from
'../../../modules/blobToArrayBuffer.js';
import { fetchBlob } from
'../../../modules/fetchBlob.js';
import { PCX } from
'../../../modules/components/image-formats/PCX.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

async function testWithFiles(logger) {
	const cases = [
		{'filename': 'format-classification/test.pcx',
			'width': 2, 'height': 13
		},
		{
			'filename': 'image-formats/parrot-tiny.pcx',
			'width': 46, 'height': 53
		},
		{
			'filename': 'image-formats/16col.pcx',
			'width': 872, 'height': 436
		},
		{
			'filename': 'image-formats/thimbleweed.pcx',
			'width': 872, 'height': 436
		},
		{'filename': 'image-formats/clown.pcx',
			'width': 320, 'height': 200
		},
		{'filename': 'image-formats/parrot.pcx',
			'width': 150, 'height': 200
		},
		{
			'filename': 'image-formats/parrot-grayscale.pcx',
			'width': 150, 'height': 200
		},
		{
			'filename': 'image-formats/parrot-grayscale-monochrome.pcx',
			'width': 150, 'height': 200
		},
	];
	for (let index = 0; index < cases.length; index++) {
		const caseInfo = cases[index];
		const plogger = prefixWrapper(`Case ${index}, filename=${caseInfo.filename}`, logger);
		const url = 'tests/data/' + caseInfo.filename;
		const arrayBuffer = await blobToArrayBuffer(await fetchBlob(url));
		const isMatch = PCX.isPossibleMatch(new Uint8Array(arrayBuffer));
		if (isMatch !== true)
			plogger(`Expected true but found ${isMatch}`);
		const imageBitmap = await PCX.arrayBufferToImageBitmap(arrayBuffer);
		if (!(imageBitmap instanceof ImageBitmap))
			plogger(`Expected an ImageBitmap but found ${imageBitmap}`);
		else {
			if (imageBitmap.width !== caseInfo.width)
				plogger(`Expected width to be ${caseInfo.width} but found ${imageBitmap.width}`);
			if (imageBitmap.height !== caseInfo.height)
				plogger(`Expected height to be ${caseInfo.height} but found ${imageBitmap.height}`);
		}
	}
}

export function testPCX(logger) {
	wrapAndCall([
		testWithFiles
	], logger);
};