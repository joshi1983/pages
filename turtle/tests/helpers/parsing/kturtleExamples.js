import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const kturtleExamples = await getContentFromReferenceArray('tests/data/logo-scripts/kturtle/index.json');

export { kturtleExamples };