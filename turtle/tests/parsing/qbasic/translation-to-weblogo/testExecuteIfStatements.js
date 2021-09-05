import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteIfStatements(logger) {
	const cases = [
	// some of these examples were copied or adapted from:
	// https://allbachelor.com/2023/08/06/exploring-arithmetic-operators-in-qbasic/
	{'code': `if true then PRINT "hi"
end if`,
	'messages': ['hi']},
	{'code': `if false then PRINT "hi"
end if`,
	'messages': [], 'analyzeCodeQuality': false},
	{'code': `if true then 
		PRINT "hi"
else
	print "bye"
end if`,
	'messages': ['hi']},
	{'code': `if false then 
		PRINT "hi"
else
	print "bye"
end if`,
	'messages': ['bye'], 'analyzeCodeQuality': false},
	{'code': `if false then 
		PRINT "hi"
elseif true then
	print "bye"
end if`,
	'messages': ['bye'], 'analyzeCodeQuality': false},
	{'code': `if false then 
		PRINT "hi"
elseif false then
	print "bye"
else 
	print "yo"
end if`,
	'messages': ['yo'], 'analyzeCodeQuality': false},
	];
	processTranslateExecuteCases(cases, logger);
};