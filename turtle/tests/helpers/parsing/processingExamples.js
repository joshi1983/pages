import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const processingExamples = await getContentFromReferenceArray('tests/data/processing/index.json');

export { processingExamples };