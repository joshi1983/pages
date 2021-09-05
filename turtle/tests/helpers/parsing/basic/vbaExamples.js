import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const vbaExamples = await getContentFromReferenceArray('tests/data/basic/visual-basic-for-applications/index.json');

export { vbaExamples };