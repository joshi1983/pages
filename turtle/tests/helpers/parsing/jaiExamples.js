import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const jaiExamples = await getContentFromReferenceArray('tests/data/jai/index.json');

export { jaiExamples };