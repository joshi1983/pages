import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const trs80BasicExamples = await getContentFromReferenceArray('tests/data/basic/trs-80-basic/index.json');

export { trs80BasicExamples };