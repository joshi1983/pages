import { getContentFromReferenceArray } from './getContentFromReferenceArray.js';

const swiftExamples = await getContentFromReferenceArray('tests/data/swift/index.json');

export { swiftExamples };