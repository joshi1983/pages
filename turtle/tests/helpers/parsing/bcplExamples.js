import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const bcplExamples = await getContentFromReferenceArray('tests/data/bcpl/index.json');

export { bcplExamples };