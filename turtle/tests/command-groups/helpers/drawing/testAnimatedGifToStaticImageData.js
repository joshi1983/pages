import { animatedGifToStaticImageData } from
'../../../../modules/command-groups/helpers/drawing/animatedGifToStaticImageData.js';
import { getUrlBase } from '../../../../modules/getUrlBase.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export async function testAnimatedGifToStaticImageData(logger) {
	const cases = [0, 0.5, 1];
	const url = getUrlBase() + 'tests/data/format-classification/test2.gif';
	cases.forEach(async function(caseInfo, index) {
		const timeRatio = caseInfo;
		const plogger = prefixWrapper(`Case ${index}, timeRatio=${timeRatio}`, logger);
		const result = await animatedGifToStaticImageData(url, timeRatio);
		if (typeof result !== 'string')
			plogger(`Expected result to be a string but got ${result}`);
	});
};