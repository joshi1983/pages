import { abs } from './abs.js';
import { add } from './add.js';
import { call } from './call.js';
import { cmp } from './cmp.js';
import { cos } from './cos.js';
import { dec } from './dec.js';
import { div } from './div.js';
import { inc } from './inc.js';
import { load } from './load.js';
import { mul } from './mul.js';
import { pop } from './pop.js';
import { processSpecialCommand } from '../../../../generic-parsing-utilities/processSpecialCommand.js';
import { push } from './push.js';
import { saveto } from './saveto.js';
import { setcolor } from './setcolor.js';
import { sin } from './sin.js';
import { sqr } from './sqr.js';
import { sqrt } from './sqrt.js';
import { sub } from './sub.js';

const specials = [abs, add, call, cmp, cos, dec, div, inc, load, mul, pop,
push, saveto, setcolor, sin, sqr, sqrt, sub];

const processSpecialInstruction = processSpecialCommand(specials);
export { processSpecialInstruction };