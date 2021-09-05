import { asyncInit, parse } from '../../../modules/parsing/python-parsing/parse.js';
import { ParseTreeToken } from '../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

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

async function testParseEscapedQuote(logger) {
	await asyncInit();
	// This is a case related to a bug in DT Python Parser explained at:
	// https://github.com/DTStack/dt-python-parser/issues/24
	// A small improvement was implemented in WebLogo to throw an Error instead of freezing.
	// This test is to make sure we don't mistakenly remove the small improvement until the problem is fixed better in DT Python Parser.
	const code = `import turtle\nprint('\\'')`;
	const tree = parse(code);
	try {
		const lexResult = window.PythonLexer(code);
	}
	catch (e) {
		// Throwing an exception is not ideal but it is better than freezing.
		//console.log('e=' + e);
	}
}

async function testParseSimpleCase(logger) {
	await asyncInit();
	const code = 'print "Hello"';
	const tree = parse(code);
	if (typeof tree !== 'object')
		logger(`parse expected to return an object but got ${tree}`);
	else if (!(tree instanceof ParseTreeToken))
		logger(`parse expected to return a ParseTreeToken but got ${tree}.  tree.constructor.name=${tree.constructor.name}`);
}

export function testParse(logger) {
	wrapAndCall([
		testAsyncInit,
		testParseEscapedQuote,
		testParseSimpleCase
	], logger);
};