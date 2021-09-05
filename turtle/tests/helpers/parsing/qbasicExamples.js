import { getContentFromReferenceArray2 } from './getContentFromReferenceArray2.js';

const [qbasicExamples, indexToFilename] = await getContentFromReferenceArray2('tests/data/qbasic/index.json');

export { qbasicExamples, indexToFilename };