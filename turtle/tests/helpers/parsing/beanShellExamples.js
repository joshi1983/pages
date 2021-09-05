import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const beanShellExamples = await getContentFromReferenceArray('tests/data/beanShell/index.json');

export { beanShellExamples };