import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const javascriptProcessingExamples = await getContentFromReferenceArray('tests/data/javascript-processing/index.json');

export { javascriptProcessingExamples };