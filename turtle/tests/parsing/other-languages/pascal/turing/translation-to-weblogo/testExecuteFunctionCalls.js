import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteFunctionCalls(logger) {
	const cases = [
	{
		'code': 'put intreal(3)',
		'messages': ['3']
	},
	{
		'code': 'put intstr(3)',
		'messages': ['3']
	},
	{'code': `function factorial (n: int) : real
		  if n = 0 then
			   result 1
		  else
			   result n * factorial (n - 1)
		  end if
	 end factorial
	 
	 var n: int := 1
	 loop
		  exit when n > 4
		  put factorial(n)
		  n += 1
	 end loop`,
	'messages': ['1', '2', '6', '24']}
	];
	processTranslateExecuteCases(cases, logger);
};