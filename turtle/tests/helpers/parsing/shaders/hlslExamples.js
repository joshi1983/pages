import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const hlslExamples = await getContentFromReferenceArray('tests/data/shaders/hlsl/index.json');

export { hlslExamples };