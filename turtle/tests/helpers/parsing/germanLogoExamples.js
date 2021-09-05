import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const germanLogoExamples = await getContentFromReferenceArray('tests/data/logo-scripts/german-logo/index.json');

export { germanLogoExamples };