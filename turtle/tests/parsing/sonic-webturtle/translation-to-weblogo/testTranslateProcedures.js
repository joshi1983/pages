import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';

export function testTranslateProcedures(logger) {
	const cases = [
	{'in': `# p
	return`, 'out': `to p
end`},
	{'in': `# p
	let x 3
	return`, 'out': `to p
	make "x 3
end`},
	{'in': `# p
	if 1 <2
		let x 3
	endif
	return`, 'out': `to p
	if 1 < 2 [
		make "x 3
	]
end`},
	{'in': `# forward
	return`, 'out': `to forward1
end`},
	{'in': `go forward
	end
# forward
	return`, 'out': `forward1

to forward1
end`}
	];
	testInOutPairs(cases, translate, logger);
};