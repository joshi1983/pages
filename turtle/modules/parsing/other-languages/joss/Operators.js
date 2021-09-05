import { GenericOperators } from
'../../generic-parsing-utilities/GenericOperators.js';
import { MigrationInfo } from
'./MigrationInfo.js';
const operators = MigrationInfo.getData().operators;

const Operators = new GenericOperators(operators, []);
export { Operators };