import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSwitch(logger) {
	const cases = [
		{'code': `switch`, 'messages': []},
		{'code': `int num = 1;

switch(num) {
}`, 'messages': []},
		{'code': `int num = 1;

switch(num) {
  default: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
	case 0:
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
  case 0: 
    println("Zero");  // Does not execute
    break;
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
  case 0: 
    println("Zero");  // Does not execute
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		/*{'code': `int num = 0;

switch(num) {
  case 0: 
    println("Zero");  // Does not execute
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['Zero', 'One']}*/
	];
	processTranslateExecuteCases(cases, logger);
};