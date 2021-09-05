import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const dartExamples = await getContentFromReferenceArray('tests/data/dart/index.json');

export { dartExamples };