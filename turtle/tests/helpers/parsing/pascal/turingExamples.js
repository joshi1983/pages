import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const turingExamples = await getContentFromReferenceArray('tests/data/pascal/turing/index.json');

export { turingExamples };