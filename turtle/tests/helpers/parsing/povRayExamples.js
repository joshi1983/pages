import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const povRayExamples = await getContentFromReferenceArray('tests/data/pov-ray/index.json');

export { povRayExamples };