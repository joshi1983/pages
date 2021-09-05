import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const asmTurtleExamples = await getContentFromReferenceArray('tests/data/asm-turtle/index.json');
export { asmTurtleExamples };