import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const juliaExamples = await getContentFromReferenceArray('tests/data/math/julia/index.json');

export { juliaExamples };