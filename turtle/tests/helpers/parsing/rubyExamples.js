import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const rubyExamples = await getContentFromReferenceArray('tests/data/ruby/index.json');

export { rubyExamples };