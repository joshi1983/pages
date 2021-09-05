import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const rustTurtleExamples = await getContentFromReferenceArray('tests/data/rust-turtle/index.json');

export { rustTurtleExamples };