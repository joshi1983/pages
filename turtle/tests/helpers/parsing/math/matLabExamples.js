import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const matLabExamples = await getContentFromReferenceArray('tests/data/math/matlab/index.json');

export { matLabExamples };