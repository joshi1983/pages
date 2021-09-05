import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const cssExamples = await getContentFromReferenceArray('tests/data/css/index.json');

export { cssExamples };