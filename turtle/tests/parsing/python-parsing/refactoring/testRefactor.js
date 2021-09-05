import { CachedParseTree } from '../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { compareTrees } from '../../../helpers/parsing/compareTrees.js';
import { asyncInit, parse } from '../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { refactor } from '../../../../modules/parsing/python-parsing/refactoring/refactor.js';

export async function testRefactor(logger) {
	await asyncInit();
	const cases = [
	{'code': `def fd():\n	pass`,
		'out': 'def fd2():\n	pass'},
	{'code': `def fd():\n	pass\nfd()\nprint('fd')`,
		'out': 'def fd2():\n	pass\nfd2()\nprint(\'fd\')'},
	];
	const compareOptions = {
		'excludeIndexProperties': true,
		'excludeKeys': ['originalString']
	};
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const treeRoot = parse(caseInfo.code);
		const cachedParseTree = new CachedParseTree(treeRoot);
		const result = refactor(cachedParseTree);
		const outTree = parse(caseInfo.out);
		compareTrees(result.root, outTree, plogger, compareOptions);
	});

};