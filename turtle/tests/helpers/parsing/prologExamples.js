import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const prologExamples = await getContentFromReferenceArray('tests/data/prolog/index.json');

export { prologExamples };