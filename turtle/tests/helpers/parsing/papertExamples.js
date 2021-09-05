import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const papertExamples = await getContentFromReferenceArray('tests/data/logo-scripts/papert/index.json');

export { papertExamples };