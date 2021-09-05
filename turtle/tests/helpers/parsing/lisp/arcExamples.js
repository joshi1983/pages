import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const arcExamples = await getContentFromReferenceArray('tests/data/lisp/arc/index.json');

export { arcExamples };