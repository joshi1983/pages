import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const kojoExamples = await getContentFromReferenceArray('tests/data/kojo/index.json');

export { kojoExamples };