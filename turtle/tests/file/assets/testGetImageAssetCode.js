import { Asset } from '../../../modules/assets/Asset.js';
import { blobToBase64 } from '../../../modules/blobToBase64.js';
import { fetchBlob } from '../../../modules/fetchBlob.js';
import { getImageAssetCode } from '../../../modules/file/assets/getImageAssetCode.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { trimDataUrlPrefix } from
'../../../modules/assets/trimDataUrlPrefix.js';

export async function testGetImageAssetCode(logger) {
	const cases1 = [
	{
		'filename': 'test.pcx', 'data': 'tests/data/image-formats/pcx/clown.pcx',
		'code': `make "height 100
imageAlpha :height * 320 / 200 :height 'local://test.pcx' 0.5`
	}
	];
	const cases = [];
	for (const caseInfo of cases1) {
		const blob = await fetchBlob(caseInfo.data);
		const data = trimDataUrlPrefix(await blobToBase64(blob));
		cases.push({
			'in': new Asset(caseInfo.filename, data),
			'out': caseInfo.code,
			'isAsync': true
		});
	}
	testInOutPairs(cases, getImageAssetCode, logger);
};