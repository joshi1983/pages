import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const cppExamples = await getContentFromReferenceArray('tests/data/c++/index.json');

export { cppExamples };