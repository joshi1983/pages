import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const odinExamples = await getContentFromReferenceArray('tests/data/odin/index.json');

export { odinExamples };