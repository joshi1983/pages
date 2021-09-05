import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const verseExamples = await getContentFromReferenceArray('tests/data/verse/index.json');

export { verseExamples };