import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const fmsLogoExamples = await getContentFromReferenceArray('tests/data/logo-scripts/fms-logo/index.json');

export { fmsLogoExamples };