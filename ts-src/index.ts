import {executeApplicationCLI} from './application-cli.js';
import {defaultCliFactory, execute} from './cli-common.js';
import {CliDomainStream, executeConditionCLI} from './condition-cli.js';
import {DataTypeCliFormat, executeDataTypeCLI} from './data-type-cli.js';
import {executeExpressionCLI, ExpressionCliFormat} from './expression-cli.js';
import {executeLogicalConditionCLI} from './logical-condition-cli.js';
import {executeRuleCLI} from './rule-cli.js';
import {executeRuleSetCLI} from './rule-set-cli.js';
import {executeRulesEngineCLI} from './rules-engine-cli.js';

export const dataTypeExecutionKey = 're-data-type';
export const expressionExecutionKey = 're-expression';
export const conditionExecutionKey = 're-condition';
export const logicalConditionExecutionKey = 're-logical-condition';
export const ruleExecutionKey = 're-rule';
export const ruleSetExecutionKey = 're-rule-set';
export const applicationExecutionKey = 're-application';
export const rulesEngineExecutionKey = 're';

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
defaultCliFactory.register({
  instanceRef: {
    refName: ruleExecutionKey,
    instance: {commandLineKey: ruleExecutionKey, cliFunction: executeRuleCLI}
  }
});
defaultCliFactory.register({
  instanceRef: {
    refName: ruleSetExecutionKey,
    instance: {commandLineKey: ruleSetExecutionKey, cliFunction: executeRuleSetCLI}
  }
});
defaultCliFactory.register({
  instanceRef: {
    refName: applicationExecutionKey,
    instance: {commandLineKey: applicationExecutionKey, cliFunction: executeApplicationCLI}
  }
});
defaultCliFactory.register({
  instanceRef: {
    refName: rulesEngineExecutionKey,
    instance: {commandLineKey: rulesEngineExecutionKey, cliFunction: executeRulesEngineCLI}
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
} else if (process.argv[2] === ruleExecutionKey) {
  execute<CliDomainStream>();
} else if (process.argv[2] === ruleSetExecutionKey) {
  execute<CliDomainStream>();
} else if (process.argv[2] === applicationExecutionKey) {
  execute<CliDomainStream>();
} else if (process.argv[2] === rulesEngineExecutionKey) {
  execute<CliDomainStream>();
}

