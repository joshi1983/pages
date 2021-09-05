import { arcLinesInfo } from './helpers/drawing/arcLinesInfo.js';
import { pathMirror } from './helpers/drawing/pathMirror.js';

export class PathCommands {
};

for (const func of [arcLinesInfo, pathMirror]) {
	PathCommands.prototype[func.name] = func;
}