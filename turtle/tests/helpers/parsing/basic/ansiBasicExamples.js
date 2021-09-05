import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const ansiBasicExamples = await getContentFromReferenceArray('tests/data/basic/ansi-basic/index.json');

export { ansiBasicExamples };