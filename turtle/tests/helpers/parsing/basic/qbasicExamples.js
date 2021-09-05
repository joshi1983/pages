import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { getContentFromReferenceArray2 } from '../getContentFromReferenceArray2.js';

const [qbasicExamples, indexToFilenameQB] = await getContentFromReferenceArray2('tests/data/basic/qbasic/index.json');
const [gwbasicExamples, indexToFilenameGW] = await getContentFromReferenceArray2('tests/data/basic/qbasic/gwbasic/index.json');
const [msxbasicExamples, indexToFilenameMSX] = await getContentFromReferenceArray2('tests/data/basic/qbasic/msxbasic/index.json');
const [qb64BasicExamples, indexToFilenameQB64] = await getContentFromReferenceArray2('tests/data/basic/qbasic/qb64/index.json');

const pairs = [
	[qbasicExamples.length, indexToFilenameQB],
	[gwbasicExamples.length, indexToFilenameGW],
	[msxbasicExamples.length, indexToFilenameMSX],
	[qb64BasicExamples.length, indexToFilenameQB64]
];

ArrayUtils.pushAll(qbasicExamples, gwbasicExamples);
ArrayUtils.pushAll(qbasicExamples, msxbasicExamples);
ArrayUtils.pushAll(qbasicExamples, qb64BasicExamples);

function indexToFilename(index) {
	let startOffset = 0;
	for (const [len, indexToFilename] of pairs) {
		if (index >= startOffset && index < index + len) {
			return indexToFilename(index - startOffset);
		}
		startOffset += len;
	}
}
export { qbasicExamples, indexToFilename };