import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const haskellExamples = await getContentFromReferenceArray('tests/data/haskell/index.json');

export { haskellExamples };