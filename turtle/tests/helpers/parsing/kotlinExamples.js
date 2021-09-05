import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const kotlinExamples = await getContentFromReferenceArray('tests/data/kotlin/index.json');

export { kotlinExamples };