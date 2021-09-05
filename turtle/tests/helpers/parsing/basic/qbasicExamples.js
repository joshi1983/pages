import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { getContentFromReferenceArray2 } from '../getContentFromReferenceArray2.js';

const [qbasicExamples, indexToFilenameQB] = await getContentFromReferenceArray2('tests/data/basic/qbasic/index.json');
const [gwbasicExamples, indexToFilenameGW] = await getContentFromReferenceArray2('tests/data/basic/qbasic/gwbasic/index.json');
const [msxbasicExamples, indexToFilenameMSX] = await getContentFromReferenceArray2('tests/data/basic/qbasic/msxbasic/index.json');

ArrayUtils.pushAll(qbasicExamples, gwbasicExamples);
ArrayUtils.pushAll(qbasicExamples, msxbasicExamples);
function indexToFilename(index) {
	const filenameQB = indexToFilenameQB(index);
	if (filenameQB !== undefined)
		return filenameQB;
	else if (index < qbasicExamples.length - msxbasicExamples.length) {
		return indexToFilenameGW(index - 
			(qbasicExamples.length - gwbasicExamples.length - msxbasicExamples.length));
	}
	else
		return indexToFilenameMSX(index - (qbasicExamples.length - msxbasicExamples.length));
}
export { qbasicExamples, indexToFilename };