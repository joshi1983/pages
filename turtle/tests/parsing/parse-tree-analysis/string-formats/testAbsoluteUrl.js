import { absoluteUrl } from '../../../../modules/parsing/parse-tree-analysis/string-formats/absoluteUrl.js';
import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testAbsoluteUrl(logger) {
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
		's': 'local:hello.txt',
		'error': true
	}
	];
	cases.forEach(function(caseInfo, index) {
		const result = absoluteUrl(caseInfo.s, false);
		const plogger = prefixWrapper(`Case ${index}. s=${caseInfo.s}`, logger);
		if ((result !== undefined) !== caseInfo.error)
			plogger(`Expected error of ${caseInfo.error} but got a message "${result}".`);
	});
};