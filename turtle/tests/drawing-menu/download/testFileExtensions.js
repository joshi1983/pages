import { FileExtensions } from '../../../modules/drawing-menu/download/FileExtensions.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testBasic(logger) {
	const extension = FileExtensions.getFileExtensionFromMime('image/jpeg');
	if (extension !== 'jpg')
		logger('Expected jpg but got ' + extension);

	const selectElement = document.createElement('select');
	FileExtensions.addOptionsToSelect(selectElement);
}

function testGetFileExtensionFromFilename(logger) {
	const cases = [
		['hello.txt', 'txt'],
		['hello.Txt', 'txt'],
		['hello.dat', 'dat'],
		['hello', undefined],
		['hello.world/file', undefined],
		['hello.world/file.txt', 'txt']
	];
	cases.forEach(function(caseInfo) {
		const result = FileExtensions.getFileExtensionFromFilename(caseInfo[0]);
		if (result !== caseInfo[1])
			logger(`Expected "${caseInfo[1]}" but got "${result}" for input ${caseInfo[0]}`);
	});
}

function testGetMimeFromExtension(logger) {
	const cases = [
		['hello.jpg', 'image/jpeg'],
		['hello.jpeg', 'image/jpeg'],
		['hello.png', 'image/png'],
		['hello.eps', 'application/postscript'],
		['eps', 'application/postscript'],
		['hello.dat', 'application/octet-stream']
	];
	cases.forEach(function(caseInfo) {
		const result = FileExtensions.getMimeFromExtension(caseInfo[0]);
		if (result !== caseInfo[1])
			logger(`Expected ${caseInfo[1]} but got ${result} for input ${caseInfo[0]}`);
	});
}

export function testFileExtensions(logger) {
	testBasic(prefixWrapper('testBasic', logger));
	testGetFileExtensionFromFilename(prefixWrapper('testGetFileExtensionFromFilename', logger));
	testGetMimeFromExtension(prefixWrapper('testGetMimeFromExtension', logger));
};