import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { validateStringFormats } from '../../../../modules/parsing/parse-tree-analysis/validation/validateStringFormats.js';

export function testValidateStringFormats(logger) {
	const cases = [
		{'code': 'setLineJoinStyle "round', 'error': false},
		{'code': 'setLineJoinStyle "bevel', 'error': false},
		{'code': 'setLineJoinStyle "miter', 'error': false},
		{'code': 'setLineJoinStyle "ROUND', 'error': false},
		{'code': 'setLineJoinStyle "ROUND', 'error': false},
		{'code': 'setLineJoinStyle "RND', 'error': true},
		{'code': 'setLineCap "square', 'error': false},
		{'code': 'setLineCap "butt', 'error': false},
		{'code': 'setLineCap "round', 'error': false},
		{'code': 'setLineCap "rnd', 'error': true},
		{'code': 'setPenBlendMode "normal', 'error': false},
		{'code': 'setPenBlendMode "difference', 'error': false},
		{'code': 'setPenBlendMode "multiply', 'error': false},
		{'code': 'setPenBlendMode "square', 'error': true},
		{'code': "image 100 100 ''", 'error': true},
		{'code': "image 100 100 'google.com'", 'error': true},
		{'code': "image 100 100 'htttp://google.com'", 'error': true}, // unsupported protocol
		{'code': "image 100 100 '/turtle/images/initial-screen-layout.png'", 'error': true},
		{'code': "image 100 100 'https://www.pixelstalk.net/wp-content/uploads/2016/07/Sunrise-Image-Photo-Free-Download.jpg'", 'error': false},
		{'code': "image 100 100 'https://www.pixelstalk.net/image.bmp'", 'error': false},
		{'code': "image 100 100 'http://127.0.0.1/image.pcx'", 'error': false},
		{'code': "image 100 100 'http://127.0.0.1/image.bmp'", 'error': false},
		{'code': "image 100 100 '" + getImageDataUrl() + "'", 'error': false},
		{'code': "image 100 100 'http:///google.com'", 'error': true}, // too many / after protocol.
	];
	processValidationTestCases(cases, logger, validateStringFormats);
};