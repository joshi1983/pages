import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const adaExamples = await getContentFromReferenceArray('tests/data/ada/index.json');

export { adaExamples };