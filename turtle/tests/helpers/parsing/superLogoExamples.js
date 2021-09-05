import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const superLogoExamples = await getContentFromReferenceArray('tests/data/logo-scripts/super-logo/index.json');

export { superLogoExamples };