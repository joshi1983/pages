import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const fSharpExamples = await getContentFromReferenceArray('tests/data/f-sharp/index.json');

export { fSharpExamples };