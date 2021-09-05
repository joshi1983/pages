import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const applesoftExamples = await getContentFromReferenceArray('tests/data/basic/applesoft-basic/index.json');

export { applesoftExamples };