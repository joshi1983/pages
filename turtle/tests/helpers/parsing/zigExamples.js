import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const zigExamples = await getContentFromReferenceArray('tests/data/zig/index.json');

export { zigExamples };