import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const cgjenningsExamples = await getContentFromReferenceArray('tests/data/l-systems/cgjennings/index.json');

export { cgjenningsExamples };