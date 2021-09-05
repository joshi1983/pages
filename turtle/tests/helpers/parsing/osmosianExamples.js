import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const osmosianExamples = await getContentFromReferenceArray('tests/data/osmosian-plain-english/index.json');

export { osmosianExamples };