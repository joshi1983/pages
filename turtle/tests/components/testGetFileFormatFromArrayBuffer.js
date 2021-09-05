import { blobToArrayBuffer } from '../../modules/blobToArrayBuffer.js';
import { fetchBlob } from '../../modules/fetchBlob.js';
import { getFileFormatFromArrayBuffer } from '../../modules/components/getFileFormatFromArrayBuffer.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testGetFileFormatFromArrayBuffer(logger) {
	/*
	We should maintain at least 1 test case for each format from json/fileExtensions.json here.

	Every format in fileExtensions.json should have a case that hints a different extension to
	verify that getFileFormatFromArrayBuffer correctly ignores the
	hintedExtension in favour of the only possible format that can be recognized.
	*/
	const cases = [
		{'url': 'tests/data/format-classification/test.avif', 'hintedExtension': 'avif', 'extension': 'avif'},
		{'url': 'tests/data/format-classification/test.avif', 'hintedExtension': 'jpg', 'extension': 'avif'},
		{'url': 'tests/data/format-classification/test.eps', 'hintedExtension': 'jpg', 'extension': 'eps'},
		{'url': 'tests/data/format-classification/test.pdf', 'hintedExtension': 'jpg', 'extension': 'pdf'},
		{'url': 'tests/data/format-classification/test.png', 'hintedExtension': 'jpg', 'extension': 'png'},
		{'url': 'tests/data/format-classification/test.gif', 'hintedExtension': 'jpg', 'extension': 'gif'},
		{'url': 'tests/data/format-classification/test.webp', 'hintedExtension': 'png', 'extension': 'webp'},
		{'url': 'tests/data/format-classification/test.jpg', 'hintedExtension': 'png', 'extension': 'jpg'},
		{'url': 'tests/data/format-classification/test.bmp', 'hintedExtension': 'bmp', 'extension': 'bmp'},
		{'url': 'tests/data/format-classification/test.wav', 'hintedExtension': 'bmp', 'extension': 'wav'},
		{'url': 'tests/data/format-classification/test.ogg', 'hintedExtension': 'ogg', 'extension': 'ogg'},
		{'url': 'tests/data/format-classification/test.mp3', 'hintedExtension': 'ogg', 'extension': 'mp3'},
		{'url': 'tests/data/format-classification/test.mid', 'hintedExtension': 'ogg', 'extension': 'mid'},
		{'url': 'tests/data/format-classification/test.mid', 'hintedExtension': 'midi', 'extension': 'midi'},
		{'url': 'tests/data/format-classification/test.mp4', 'hintedExtension': 'ogg', 'extension': 'mp4'},
		{'url': 'tests/data/format-classification/test1.html', 'hintedExtension': 'txt', 'extension': 'html'},
		{'url': 'tests/data/format-classification/test2.html', 'hintedExtension': 'txt', 'extension': 'html'},
		{'url': 'tests/data/format-classification/test3.html', 'hintedExtension': 'txt', 'extension': 'html'},
		{'url': 'images/logo-32px.png', 'hintedExtension': 'jpg', 'extension': 'png'},
		{'url': 'images/logo-128px.png', 'hintedExtension': 'jpg', 'extension': 'png'},
		{'url': 'images/logo.svg', 'hintedExtension': 'jpg', 'extension': 'svg'},
		{'url': 'images/logo-transparent.svg', 'hintedExtension': 'jpg', 'extension': 'svg'},
	];
	cases.forEach(async function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const blob = await fetchBlob(caseInfo.url);
		const data = await blobToArrayBuffer(blob);
		const result = getFileFormatFromArrayBuffer(data, caseInfo.hintedExtension);
		if (typeof result !== 'string')
			plogger(`Expected result to be a string but got ${result}`);
		else if (result !== caseInfo.extension)
			plogger(`Expected extension ${caseInfo.extension} but got ${result}`);
	});
};