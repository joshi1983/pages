import { asyncInit, parse } from '../../../modules/parsing/python-parsing/parse.js';
import { ParseTreeToken } from '../../../modules/parsing/python-parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testAsyncInit(logger) {
	let isResolved = false;
	asyncInit().then(function() {
		isResolved = true;
	});
	const maxDelay = 10000;
	setTimeout(function() {
		if (!isResolved) {
			logger(`Expected asyncInit to resolve after ${maxDelay}ms but it did not`);
		}
	}, maxDelay);
}

async function testParseSimpleCase(logger) {
	await asyncInit();
	const code = 'print "Hello"';
	const tree = parse(code);
	if (typeof tree !== 'object')
		logger(`parse expected to return an object but got ${tree}`);
	else if (!(tree instanceof ParseTreeToken))
		logger(`parse expected to return a ParseTreeToken but got ${tree}`);
}

export function testParse(logger) {
	testAsyncInit(prefixWrapper('testAsyncInit', logger));
	testParseSimpleCase(prefixWrapper('testParseSimpleCase', logger));
};