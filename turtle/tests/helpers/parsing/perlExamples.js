import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const perlExamples = await getContentFromReferenceArray('tests/data/perl/index.json');

export { perlExamples };