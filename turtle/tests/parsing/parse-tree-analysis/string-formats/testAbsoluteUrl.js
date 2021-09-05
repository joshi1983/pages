import { absoluteUrl } from '../../../../modules/parsing/parse-tree-analysis/string-formats/absoluteUrl.js';
import { AssetRepository } from '../../../../modules/assets/AssetRepository.js';
import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { processStringFormatTestCases } from './processStringFormatTestCases.js';

export function testAbsoluteUrl(logger) {
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
		's': `local:${filename}`,
		'error': true
	}
	];
	let asset;
	if (AssetRepository.getAssetByFilename(filename) === undefined) {
		asset = AssetRepository.getOrCreateAssetByFilename(filename);
	}
	processStringFormatTestCases(cases, logger, absoluteUrl);
	if (asset !== undefined)
		AssetRepository.remove(asset);
};