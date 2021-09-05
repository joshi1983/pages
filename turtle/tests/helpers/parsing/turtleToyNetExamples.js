import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const turtleToyNetExamples = await getContentFromReferenceArray('tests/data/turtletoy-net/index.json');

export { turtleToyNetExamples };