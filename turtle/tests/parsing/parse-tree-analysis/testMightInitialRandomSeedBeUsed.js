import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { mightInitialRandomSeedBeUsed } from
'../../../modules/parsing/parse-tree-analysis/mightInitialRandomSeedBeUsed.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function testMightInitialRandomSeedBeUsed(logger) {
	const cases = [
	{'code': '', 'out': false},
	{'code': 'fd 100', 'out': false},
	{'code': 'fd randomRatio', 'out': true},
	{'code': '(rerandom randomRatio) print randomRatio', 'out': true},
	{'code': '(rerandom 10 + randomRatio) print randomRatio', 'out': true},
	{'code': 'rerandom\nfd randomRatio', 'out': false},
	{'code': 'p rerandom\n to p\nprint randomRatio\nend', 'out': true},
	{'code': 'to p\nprint randomRatio\nend', 'out': false},
	{'code': 'to p\nprint randomRatio\nend\np', 'out': true},
	{'code': `fd animation.time
to animation.snapshotstyle
	localmake "result createPList
	setProperty "result "zoom.scale 1 + randomRatio
	output :result
end
p`, 'out': true},
	{'code': `fd animation.time
to animation.setup
	localmake "result createPList
	setProperty "result "duration 1 + random 10
	output :result
end
p`, 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const result = mightInitialRandomSeedBeUsed(tree);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};