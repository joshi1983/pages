import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const glslExamples = await getContentFromReferenceArray('tests/data/shaders/glsl/index.json');

export { glslExamples };