import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getSuggestions } from '../../../../modules/components/code-editor/code-completion/getSuggestions.js';

export function testGetSuggestions(logger) {
	const initialVariables = new Map();
	const proceduresMap = new Map();
	const code = `make "x 4
print :
print :x
print :y`;
	let position = {'lineIndex': 1, 'colIndex': 7};
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const root = cachedParseTree.root;
	let result = getSuggestions(proceduresMap, root, position, initialVariables);
	if (!(result.strings instanceof Array))
		logger(`result.strings expected to be an Array but got ${result.strings}`);
	if (!Number.isInteger(result.typedIndex))
		logger(`result.typedIndex expected to be an integer but got ${result.typedIndex}`);
	if (result.strings.length !== 1)
		logger(`Expected result.strings.length to be 1 but got ${result.strings.length}`);
	position.colIndex = 8;
	result = getSuggestions(proceduresMap, root, position, initialVariables);
	if (result.strings.length !== 0)
		logger(`With colIndex 8, expected result.strings.length to be 0 but got ${result.strings.length}`);
	position.colIndex = 6;
	result = getSuggestions(proceduresMap, root, position, initialVariables);
	if (result.strings.length !== 0)
		logger(`With colIndex 6, expected result.strings.length to be 0 but got ${result.strings.length}`);
};