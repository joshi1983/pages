import { arcLinesInfo } from
'./helpers/drawing/arcLinesInfo.js';
import { pathCutFromStart } from
'./helpers/drawing/pathCutFromStart.js';
import { pathLength } from
'./helpers/drawing/pathLength.js';
import { pathMirror } from
'./helpers/drawing/pathMirror.js';

export class PathCommands {
};

for (const func of [arcLinesInfo, pathCutFromStart, pathLength, pathMirror]) {
	PathCommands.prototype[func.name] = func;
}