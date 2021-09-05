import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const kturtleExampleFiles = await getContentFromReferenceArray('tests/data/logo-scripts/kturtle/index.json');

export { kturtleExampleFiles };