import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const cSharpExamples = await getContentFromReferenceArray('tests/data/c-sharp/index.json');

export { cSharpExamples };