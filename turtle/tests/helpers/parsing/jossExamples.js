import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const jossExamples = await getContentFromReferenceArray('tests/data/joss/index.json');

export { jossExamples };