import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const batchExamples = await getContentFromReferenceArray('tests/data/batch/index.json');

export { batchExamples };