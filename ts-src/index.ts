import {defaultCliFactory, execute} from './cli-common.js';
import {CliDomainStream, executeConditionCLI} from './condition-cli.js';
import {DataTypeCliFormat, executeDataTypeCLI} from './data-type-cli.js';
import {executeExpressionCLI, ExpressionCliFormat} from './expression-cli.js';
import {executeLogicalConditionCLI} from './logical-condition-cli.js';

export const dataTypeExecutionKey = 're-data-type';
export const expressionExecutionKey = 're-expression';
export const conditionExecutionKey = 're-condition';
export const logicalConditionExecutionKey = 're-logical-condition';


defaultCliFactory.register({
  instanceRef: {
    refName: dataTypeExecutionKey,
    instance: {commandLineKey: dataTypeExecutionKey, cliFunction: executeDataTypeCLI}
  }
});
defaultCliFactory.register({
  instanceRef: {
    refName: expressionExecutionKey,
    instance: {commandLineKey: expressionExecutionKey, cliFunction: executeExpressionCLI}
  }
});
defaultCliFactory.register({
  instanceRef: {
    refName: conditionExecutionKey,
    instance: {commandLineKey: conditionExecutionKey, cliFunction: executeConditionCLI}
  }
});
defaultCliFactory.register({
  instanceRef: {
    refName: logicalConditionExecutionKey,
    instance: {commandLineKey: logicalConditionExecutionKey, cliFunction: executeLogicalConditionCLI}
  }
});


if (process.argv[2] === dataTypeExecutionKey) {
  execute<DataTypeCliFormat>();
} else if (process.argv[2] === expressionExecutionKey) {
  execute<ExpressionCliFormat>();
} else if (process.argv[2] === conditionExecutionKey) {
  execute<CliDomainStream>();
} else if (process.argv[2] === logicalConditionExecutionKey) {
  execute<CliDomainStream>();
}

