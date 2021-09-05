import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { getContentFromReferenceArray2 } from '../getContentFromReferenceArray2.js';

const [qbasicExamples, indexToFilenameQB] = await getContentFromReferenceArray2('tests/data/basic/qbasic/index.json');
const [gwbasicExamples, indexToFilenameGW] = await getContentFromReferenceArray2('tests/data/basic/qbasic/gwbasic/index.json');

ArrayUtils.pushAll(qbasicExamples, gwbasicExamples);
function indexToFilename(index) {
	const filenameQB = indexToFilenameQB(index);
	if (filenameQB !== undefined)
		return filenameQB;
	else
		return indexToFilenameGW(index - (qbasicExamples.length - gwbasicExamples.length));
}
export { qbasicExamples, indexToFilename };