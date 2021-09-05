import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const apexExamples = await getContentFromReferenceArray('tests/data/apex-salesforce/index.json');

export { apexExamples };