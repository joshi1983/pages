import { getContentFromReferenceArray2 } from './getContentFromReferenceArray2.js';

const [logoInterpreterExamples, indexToFilename] = await getContentFromReferenceArray2('tests/data/logo-scripts/logo-interpreter/index.json');

export { logoInterpreterExamples, indexToFilename };