import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const luaExamples = await getContentFromReferenceArray('tests/data/lua/index.json');

export { luaExamples };