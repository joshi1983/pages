import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const elmExamples = await getContentFromReferenceArray('tests/data/elm/index.json');

export { elmExamples };