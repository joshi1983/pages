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
	{'code': `if 1 > 0 then print "hi"
print "last"`,
	'messages': ['hi', 'last']
	// this output was verified by running the same code at:
	// https://archive.org/details/msdos_qbasic_megapack
	},
	{'code': `IF 1 < 0 THEN PRINT "hi"
PRINT "last"`,
	'messages': ['last']
	// this output was verified by running the same code at:
	// https://archive.org/details/msdos_qbasic_megapack
	},
	{'code': `IF 0 > 1 THEN PRINT "hi": PRINT "yo"
PRINT "after"`,
	'messages': ['after']
	}
	];
	processTranslateExecuteCases(cases, logger);
};