import {defaultCliFactory, execute} from './cli-common.js';
import {DataTypeCliFormat, executeDataTypeCLI} from './data-type-cli.js';
import {executeExpressionCLI, ExpressionCliFormat} from './expression-cli.js';

export const dataTypeExecutionKey = 're-data-type';
export const expressionExecutionKey = 're-expression';

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

if (process.argv[2] === dataTypeExecutionKey) {
  execute<DataTypeCliFormat>();
} else if (process.argv[2] === expressionExecutionKey) {
  execute<ExpressionCliFormat>();
}
