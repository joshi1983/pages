import { encodeUrl } from '../../../../modules/drawing/drawers/svg/encodeUrl.js';
import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';

export function testEncodeUrl(logger) {
	const cases = [
		{'in': 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AATzQ3u.img?h=1536&w=2560&m=6&q=60&o=f&l=f',
		'out': 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AATzQ3u.img?h=1536&amp;w=2560&amp;m=6&amp;q=60&amp;o=f&amp;l=f'}
	];
	const dataUrlCase = {'in': getImageDataUrl(), 'out': getImageDataUrl()};
	cases.push(dataUrlCase);
	cases.forEach(function(caseInfo) {
		const result = encodeUrl(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};