import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

const definingParentTypesOfInterest = new Set([
ParseTreeTokenType.ASYNC,
ParseTreeTokenType.CLASS,
ParseTreeTokenType.CONST,
ParseTreeTokenType.FUNCTION,
ParseTreeTokenType.IMPORT,
ParseTreeTokenType.INTERFACE,
ParseTreeTokenType.LET,
ParseTreeTokenType.STATIC,
ParseTreeTokenType.VAR
]);

export { definingParentTypesOfInterest };