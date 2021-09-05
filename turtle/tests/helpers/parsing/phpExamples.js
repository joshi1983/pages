import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const phpExamples = await getContentFromReferenceArray('tests/data/php/index.json');

export { phpExamples };