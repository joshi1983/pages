import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { processValidationTestCase } from './processValidationTestCase.js';
import { validateStringFormats } from '../../../../modules/parsing/parse-tree-analysis/validation/validateStringFormats.js';

export function testValidateStringFormats(logger) {
	const cases = [
		{'code': "image 100 100 ''", 'error': true},
		{'code': "image 100 100 'google.com'", 'error': true},
		{'code': "image 100 100 'htttp://google.com'", 'error': true}, // unsupported protocol
		{'code': "image 100 100 '/turtle/images/initial-screen-layout.png'", 'error': true},
		{'code': "image 100 100 'https://www.pixelstalk.net/wp-content/uploads/2016/07/Sunrise-Image-Photo-Free-Download.jpg'", 'error': false},
		{'code': "image 100 100 '" + getImageDataUrl() + "'", 'error': false},
	];
	cases.forEach(function(caseInfo) {
		processValidationTestCase(caseInfo, logger, validateStringFormats);
	});
};