import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { mightInitialRandomSeedBeUsedInProcedure } from
'../../../modules/parsing/parse-tree-analysis/mightInitialRandomSeedBeUsedInProcedure.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function testMightInitialRandomSeedBeUsedInProcedure(logger) {
	const cases = [
	{'code': 'to animation.snapshotstyle\nend', 'out': false},
	{'code': 'rerandom to animation.snapshotstyle\nend', 'out': false},
	{'code': 'rerandom to animation.snapshotstyle\nrerandom\nend', 'out': false},
	{'code': 'to animation.snapshotstyle\noutput createPList2 [["duration random 10]]\nend',
		'out': true},
	{'code': 'to p\nend\nto animation.snapshotstyle\np\noutput createPList2 [["duration random 10]]\nend',
		'out': true},
	{'code': 'to p\noutput random 10\nend\nto animation.snapshotstyle\np\noutput createPList2 [["duration p]]\nend',
		'out': true},
	{'code': 'to p\noutput q\nend\nto q\noutput random 10\nend\nto animation.snapshotstyle\np\noutput createPList2 [["duration p]]\nend',
		'out': true},
	{'code': 'to p\noutput 10\nend\nto animation.snapshotstyle\np\noutput createPList2 [["duration p]]\nend',
		'out': false},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const result = mightInitialRandomSeedBeUsedInProcedure(tree, 'animation.snapshotstyle');
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};