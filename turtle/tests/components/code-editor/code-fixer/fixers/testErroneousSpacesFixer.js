import { FixLogger } from '../../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { erroneousSpacesFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/erroneousSpacesFixer.js';
import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { parseTreeToCodeWithComments } from '../../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';
import { WriteOptimizedCachedParseTree } from '../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

export function testErroneousSpacesFixer(logger) {
	const code = 'setProperty  :\nsetFillRadialGros pos';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const fixLogger = new FixLogger(parseLogger);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, new Map());
	erroneousSpacesFixer(cachedParseTree, fixLogger);
	const allTokens = ParseTreeToken.flatten(tree);
	const fixedToken = allTokens.
		filter(t => t.val === 'setFillRadialGros' && t.type === ParseTreeTokenType.VARIABLE_READ)[0];
	if (!(fixedToken instanceof ParseTreeToken))
		logger('Expected to find a variable read with value setFillRadialGros after fixing the erroneous spaces between : and the name in code: ' + code);
	if (fixedToken.type !== ParseTreeTokenType.VARIABLE_READ)
		logger(`Expected the token with val "${setFillRadialGros}" to be a VARIABLE_READ token but found type ${ParseTreeTokenType.getNameFor(fixedToken.type)}`);
	const parentToken = allTokens.filter(t => t.val === 'setProperty')[0];
	if (!(parentToken instanceof ParseTreeToken))
		logger('Expected to find a token with val setProperty in code: ' + code);
	if (parentToken.children[0].val !== 'setFillRadialGros')
		logger(`After calling erroneousSpacesFixer, expected first child of token with val=setProperty to have val setFillRadialGros but the first child had val="${parentToken.children[0].val}" in code: ` + code);
	if (parentToken.children.length !== 2)
		logger(`After calling erroneousSpacesFixer, expected there to be 2 children(setFillRadialGros and pos) but found ${parentToken.children.length}`);

	const fixedCode = parseTreeToCodeWithComments(tree, code);
	const expectedCode = 'setProperty  \n:setFillRadialGros pos';
	if (fixedCode !== expectedCode)
		logger(`Expected fixed code to be "${expectedCode}" but instead got "${fixedCode}"`);
};