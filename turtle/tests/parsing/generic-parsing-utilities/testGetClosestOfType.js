import { getClosestOfType } from '../../../modules/parsing/generic-parsing-utilities/getClosestOfType.js';
import { flatten } from '../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testWithJSParser(logger) {
	const parseResult = parse('1+4');
	const allTokens = flatten(parseResult.root);
	const fourToken = allTokens.filter(t => t.val === '4')[0];
	if (fourToken === undefined)
		logger(`Expected to find a token with value of 4 but not found`);
	else {
		const root = getClosestOfType(fourToken, ParseTreeTokenType.TREE_ROOT);
		if (root === null)
			logger(`Expected to get a ParseTreeToken but got ${root}`);
		else if (root.type !== ParseTreeTokenType.TREE_ROOT)
			logger(`Expected to get a token with type TREE_ROOT but got a type of ${ParseTreeTokenType.getNameFor(root.type)}`);
	}
}

export function testGetClosestOfType(logger) {
	wrapAndCall([
		testWithJSParser
	], logger);
};