import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {Scope} from '@franzzemen/re-common';
import {Rule, RuleParser, RuleScope} from '@franzzemen/re-rule';
import {isPromise} from 'node:util/types';
import {CliFunction, logParserMessages} from './cli-common.js';
import {CliDomainStream} from './condition-cli.js';

export const executeRuleCLI: CliFunction<CliDomainStream> = (iteration: CliDomainStream, ec?: ExecutionContextI) => {
  const log = new LoggerAdapter(ec, 're-cli', 'rule-cli', 'executeRuleCLI');
  try {
    if (iteration) {
      log.info(`Text to parse: "${iteration.text}"`);
      let scope: RuleScope = new RuleScope({}, undefined, ec);
      const parser: RuleParser = scope.get(RuleScope.RuleParser);
      let [remaining, ref, parserMessages] = parser.parse(iteration.text, undefined, undefined,  ec);
      if(ref) {
        scope = ref.loadedScope;
      }
      if (!scope.isResolved()) {
        const truVal = Scope.resolve(scope, ec);
        if (isPromise(truVal)) {
          throw new Error('Asyc not yet supported in cli');
        }
      }
      logParserMessages(parserMessages, ec);
      if (log.isInfoEnabled()) {
        if (ref) {
          log.debug(ref, 'Rule reference');
        }
        if (remaining && remaining.trim().length > 0) {
          log.debug(`Remaining: ${remaining}`);
        }
      } else {
        log.info('Rule reference parsed');
      }
      const rule = new Rule(ref, scope, ec);
      log.debug(rule, 'Created rule');
      if (iteration.dataStream.length > 0) {
        log.info('Processing data stream');
      }
      iteration.dataStream.forEach(streamItem => {
        const truOrPromise = rule.awaitEvaluation(streamItem.data);
        if (isPromise(truOrPromise)) {
          throw new Error('Promises not yet implemented for Cli');
        } else {
          log.info(`Evaluating streaming item ${streamItem.description ? streamItem.description : '(no description)'}`);
          if (truOrPromise.valid === streamItem.expectedResult) {
            log.info(`Rule evaluates to ${truOrPromise} as expected`);
          } else {
            log.info(`Rule evaluates to ${truOrPromise} unexpectedly`);
          }
        }
      });
    }
  } catch (err) {
    log.error(err);
  }
};


