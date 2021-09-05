import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const gleamExamples = await getContentFromReferenceArray('tests/data/gleam/index.json');

export { gleamExamples };