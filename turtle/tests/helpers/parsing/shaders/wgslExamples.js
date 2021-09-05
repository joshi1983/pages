import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const wgslExamples = await getContentFromReferenceArray('tests/data/shaders/wgsl/index.json');

export { wgslExamples };