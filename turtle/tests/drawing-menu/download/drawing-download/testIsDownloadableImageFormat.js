import { FileExtensions } from
'../../../../modules/drawing-menu/download/FileExtensions.js';
import { isDownloadableImageFormat } from
'../../../../modules/drawing-menu/download/drawing-download/isDownloadableImageFormat.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsDownloadableImageFormat(logger) {
	const cases = [
		{'in': 'jpg', 'out': true},
		{'in': 'pcx', 'out': false},
		{'in': 'png', 'out': true},
		{'in': 'wav', 'out': false},
	];
	for (const caseInfo of cases) {
		const extension = caseInfo.in;
		const matches = FileExtensions.getAll().filter(formatInfo => FileExtensions.matchesFileExtension(formatInfo, extension));
		caseInfo.in = matches[0];
		if (typeof caseInfo.in !== 'object') {
			logger(`Unable to find information for a file format with extension ${extension}`);
			return;
		}
	}
	testInOutPairs(cases, isDownloadableImageFormat, logger);
};