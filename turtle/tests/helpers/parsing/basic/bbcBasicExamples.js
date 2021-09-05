import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const bbcBasicExamples = await getContentFromReferenceArray('tests/data/basic/bbc-basic/index.json');

export { bbcBasicExamples };