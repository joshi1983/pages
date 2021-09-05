import { Command } from '../Command.js';
import { convertWebLogoTypesToGolang } from './parsing/parse-tree-analysis/convertWebLogoTypesToGolang.js';
import { fetchJson } from '../../fetchJson.js';
import { GenericOperators } from '../generic-parsing-utilities/GenericOperators.js';
const operators = await fetchJson('json/logo-migrations/pitrified-go-turtle/operators.json');

await Command.asyncInit();

for (const opInfo of operators) {
	if (opInfo.unary !== undefined) {
		if (opInfo.unary.returnTypes === undefined) {
			if (opInfo.unary.toCommand !== undefined) {
				const types = Command.getCommandInfo(opInfo.unary.toCommand).returnTypes;
				const golangTypes = convertWebLogoTypesToGolang(types);
				if (golangTypes !== undefined)
					opInfo.unary.returnTypes = golangTypes;
			}
		}
	}
}

const Operators = new GenericOperators(operators, []);
export { Operators };