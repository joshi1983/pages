import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const groovyExamples = await getContentFromReferenceArray('tests/data/groovy/index.json');

export { groovyExamples };