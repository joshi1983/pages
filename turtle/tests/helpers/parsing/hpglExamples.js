import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const hpglExamples = await getContentFromReferenceArray('tests/data/hpgl/index.json');

export { hpglExamples };