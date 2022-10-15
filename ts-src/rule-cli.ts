import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {LogicalOperator, Scope} from '@franzzemen/re-common';
import {
  endConditionTests, LogicalConditionGroup,
  LogicalConditionGroupParser,
  LogicalConditionScope,
  logicalOperators
} from '@franzzemen/re-logical-condition';
import {isPromise} from 'node:util/types';
import {CliFunction, logParserMessages} from './cli-common.js';
import {CliDomainStream} from './condition-cli.js';

export const executeLogicalConditionCLI: CliFunction<CliDomainStream> = (iteration: CliDomainStream, ec?: ExecutionContextI) => {
  const log = new LoggerAdapter(ec, 're-cli', 'rule-cli', 'executeLogicalConditionCLI');
  try {
    if (iteration) {
      log.info(`Text to parse: "${iteration.text}"`);
      const scope: LogicalConditionScope = new LogicalConditionScope({}, undefined, ec);
      const parser: LogicalConditionGroupParser = scope.get(LogicalConditionScope.LogicalConditionParser);
      let [remaining, grouping, endConditions, parserMessages] = parser.parse(iteration.text, scope, logicalOperators, LogicalOperator.and, endConditionTests, undefined, ec);
      if (!scope.isResolved()) {
        const truVal = Scope.resolve(scope, ec);
        if (isPromise(truVal)) {
          throw new Error('Asyc not yet supported in cli');
        }
      }
      logParserMessages(parserMessages, ec);
      if (log.isInfoEnabled()) {
        if (grouping) {
          log.debug(grouping, 'Logical Condition Group Reference');
        }
        if (remaining && remaining.trim().length > 0) {
          log.debug(`Remaining: ${remaining}`);
        }
      } else {
        log.info('Logical Condition Group Reference Parsed');
      }
      const logicalConditionGroup = new LogicalConditionGroup(grouping, scope, ec);
      log.debug(logicalConditionGroup, 'Created logical condition group');
      if (iteration.dataStream.length > 0) {
        log.info('Processing data stream');
      }
      iteration.dataStream.forEach(streamItem => {
        const truOrPromise = logicalConditionGroup.awaitEvaluation(streamItem.data, scope, ec);
        if (isPromise(truOrPromise)) {
          throw new Error('Promises not yet implemented for Cli');
        } else {
          log.info(`Evaluating streaming item ${streamItem.description ? streamItem.description : '(no description)'}`);
          if (truOrPromise.result === streamItem.expectedResult) {
            log.info(`Logical condition group evaluates to ${truOrPromise} as expected`);
          } else {
            log.info(`Logical condition group evaluates to ${truOrPromise} unexpectedly`);
          }
        }
      });
    }
  } catch (err) {
    log.error(err);
  }
};


