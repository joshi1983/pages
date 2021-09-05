import { getContentFromReferenceArray } from '../getContentFromReferenceArray.js';

const ocamlExamples = await getContentFromReferenceArray('tests/data/ml/ocaml/index.json');

export { ocamlExamples };