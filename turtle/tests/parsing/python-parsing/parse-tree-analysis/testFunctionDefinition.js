import { getAllFunctionDefinitions } from
'../../../../modules/parsing/python-parsing/parse-tree-analysis/getAllFunctionDefinitions.js';
import { getCachedParseTreeFromPythonCode } from
'../../../helpers/parsing/getCachedParseTreeFromPythonCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testDeclaresGlobalName(logger) {
	const cases = [
	{'code': 'def f():\n\tpass',
		'globalNames': []
	},
	{'code': 'def f():\n\tglobal x\n\tpass',
		'globalNames': ['x']
	},
	{'code': 'def f():\n\tglobal x,y\n\tpass',
		'globalNames': ['x', 'y']
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromPythonCode(caseInfo.code);
		const functions = getAllFunctionDefinitions(tree);
		if (functions.length !== 1)
			plogger(`Expected 1 function but got ${functions.length}`);
		else {
			const definition = functions[0];
			caseInfo.globalNames.forEach(function(name) {
				if (!definition.declaresGlobalName(name))
					plogger(`Expected to declare global name: ${name} but declaration was not found.`);
			});
		}
	});
};

function testUsesParameterName(logger) {
	const cases = [
	{'code': 'def f():\n\tpass',
		'parameterNames': []
	},
	{'code': 'def f(x):\n\tpass',
		'parameterNames': ['x']
	},
	{'code': 'def f(x,y):\n\tpass',
		'parameterNames': ['x', 'y']
	},
	{'code': 'def f(x,y=5):\n\tpass',
		'parameterNames': ['x', 'y']
	},
	{'code': 'def f(x,y=None):\n\tpass',
		'parameterNames': ['x', 'y']
	},
	{'code': 'def f(x=[],y=None):\n\tpass',
		'parameterNames': ['x', 'y']
	},
	{'code': `def f(*argv):
	for arg in argv:
		print(arg)`,
		'parameterNames': ['argv']
	},
	{'code': 'def f(**kwargs):\n\tpass',
		'parameterNames': ['kwargs']
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromPythonCode(caseInfo.code);
		const functions = getAllFunctionDefinitions(tree);
		if (functions.length !== 1)
			plogger(`Expected 1 function but got ${functions.length}`);
		else {
			const definition = functions[0];
			caseInfo.parameterNames.forEach(function(name) {
				if (!definition.usesParameterName(name))
					plogger(`Expected to use parameter name: ${name} but not found.`);
			});
		}
	});
}

export async function testFunctionDefinition(logger) {
	wrapAndCall([
		testDeclaresGlobalName,
		testUsesParameterName
	], logger);
};