import { getContentFromReferenceArray2 } from './getContentFromReferenceArray2.js';

const [terrapinExamples, indexToFilename] = await getContentFromReferenceArray2('tests/data/logo-scripts/terrapin/index.json');

export { terrapinExamples, indexToFilename };