import { absoluteUrl, getProtocol } from
'../../../../modules/parsing/parse-tree-analysis/string-formats/absoluteUrl.js';
import { AssetRepository } from '../../../../modules/assets/AssetRepository.js';
import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testGetProtocol(logger) {
	const cases = [
	{'in': 'http://google.com', 'out': 'http'},
	{'in': 'https://google.com', 'out': 'https'},
	{'in': 'local://image.jpg', 'out': 'local'},
	{'in': 'weblogo://image.jpg', 'out': 'weblogo'},
	{'in': 'local://image.pcx', 'out': 'local'},
	{'in': 'weblogo://image.pcx', 'out': 'weblogo'},
	{'in': 'local://image.ppm', 'out': 'local'},
	{'in': 'weblogo://image.ppm', 'out': 'weblogo'},
	{'in': 'local://image.bmp', 'out': 'local'},
	{'in': 'weblogo://image.bmp', 'out': 'weblogo'},
	];
	testInOutPairs(cases, getProtocol, logger);
};

function testAbsoluteUrlFunction(logger) {
	const filename = 'hello.txt';
	const cases = [
	{
		's': 'google.com',
		'error': true // no protocol
	},
	{
		's': 'https://www.pixelstalk.net/wp-content/uploads/2016/07/Sunrise-Image-Photo-Free-Download.jpg', 
		'error': false
	},
	{
		's': 'https:www.pixelstalk.net/wp-content/uploads/2016/07/Sunrise-Image-Photo-Free-Download.jpg', 
		'error': true // slashes needed for http or https protocol.
	},
	{
		's': 'http:www.pixelstalk.net/wp-content/uploads/2016/07/Sunrise-Image-Photo-Free-Download.jpg', 
		'error': true // slashes needed for http or https protocol.
	},
	{
		's': 'http://127.0.0.1/hello.txt',
		'error': false
	},
	{
		's': 'https://127.0.0.1/hello.txt',
		'error': false
	},
	{
		's': getImageDataUrl(),
		'error': false
	},
	{
		's': 'hello.txt',
		'error': true // no protocol
	},
	{
		's': 'local://hello.txt',
		'error': false
	},
	{
		's': 'weblogo://logo-scripts/images/sketch.jpg',
		'error': false
	},
	{
		's': 'weblogo://tests/data/image-formats/pcx/clown.pcx',
		'error': false
	},
	{
		's': 'weblogo://tests/data/image-formats/bitmap/JUR_OS2_small.bmp',
		'error': false
	},
	{
		's': 'weblogo://logo-scripts/images/sketch-inner.png',
		'error': false
	},
	{
		's': `local:${filename}`,
		'error': true // asset doesn't exist.
	},
	{
		's': 'http:///google.com',
		'error': true // too many slashes
	}
	];
	let asset;
	if (AssetRepository.getAssetByFilename(filename) === undefined) {
		asset = AssetRepository.getOrCreateAssetByFilename(filename);
	}
	processStringFormatTestCases(cases, logger, absoluteUrl);
	if (asset !== undefined)
		AssetRepository.remove(asset);
}

export function testAbsoluteUrl(logger) {
	wrapAndCall([
		testAbsoluteUrlFunction,
		testGetProtocol
	], logger);
};