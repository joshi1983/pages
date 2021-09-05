import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const mlExamples = await getContentFromReferenceArray('tests/data/ml/index.json');

export { mlExamples };