import { CachedParseTree } from '../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { compareTrees } from '../../../helpers/parsing/compareTrees.js';
import { FunctionRename } from '../../../../modules/parsing/python-parsing/refactoring/FunctionRename.js';
import { asyncInit, parse } from '../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function testExecute(logger) {
	const cases = [
	{'code': `def fd():\n	pass`,
		'out': 'def fd2():\n	pass'},
	//	function definition names should be changed if they conflict with a WebLogo command.
	{'code': `def fd():\n	pass\nfd()\nprint('fd')`,
		'out': 'def fd2():\n	pass\nfd2()\nprint(\'fd\')'},
		// string literal values should not be changed.

	{'code': `def fd():\n	pass\nfd()\nx = A()\nx.fd()`,
		'out': 'def fd2():\n	pass\nfd2()\nx = A()\nx.fd()'},
		// method calls should not be changed.
	{'code': `def f():\n	pass\ndef F():\n	pass`,
		'out': 'def f():\n	pass\ndef F2():\n	pass'}
	];
	const compareOptions = {
		'excludeIndexProperties': true,
		'excludeKeys': ['originalString']
	};
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const treeRoot = parse(caseInfo.code);
		FunctionRename.execute(treeRoot);
		const outTree = parse(caseInfo.out);
		compareTrees(treeRoot, outTree, plogger, compareOptions);
	});
}

function testIsNeededFor(logger) {
	const cases = [
	{'code': `print('hi')`, 'out': false},
	{'code': `def p():\n	pass`, 'out': false},
	{'code': `def fd():\n	pass`, 'out': true},
	{'code': `def forward():\n	pass`, 'out': true},
	{'code': `def end():\n	pass`, 'out': true},
	{'code': `def circle():\n	pass`, 'out': true},
	{'code': `def f():\n	pass\ndef F_():\n	pass`, 'out': false},
	{'code': `def f():\n	pass\ndef F():\n	pass`, 'out': true}
	// not conflicting with a command or keyword but f and F will be
	// considered the same name in case-insensitive WebLogo.
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const treeRoot = parse(caseInfo.code);
		const cachedTree = new CachedParseTree(treeRoot);
		const result = FunctionRename.isNeededFor(cachedTree);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
}

export async function testFunctionRename(logger) {
	await asyncInit();
	testExecute(prefixWrapper('testExecute', logger));
	testIsNeededFor(prefixWrapper('testIsNeededFor', logger));
};