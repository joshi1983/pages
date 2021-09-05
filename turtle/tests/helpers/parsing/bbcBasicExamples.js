import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const bbcBasicExamples = await getContentFromReferenceArray('tests/data/bbc-basic/index.json');

export { bbcBasicExamples };