import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {ReParser, ReScope} from '@franzzemen/re';
import {Scope} from '@franzzemen/re-common';
import {Rule, RuleParser, RuleScope} from '@franzzemen/re-rule';
import {RuleSet, RuleSetParser, RuleSetScope} from '@franzzemen/re-rule-set';
import {isPromise} from 'node:util/types';
import {CliFunction, logParserMessages} from './cli-common.js';
import {CliDomainStream} from './condition-cli.js';
import {Rules} from '@franzzemen/re';

export const executeRulesEngineCLI: CliFunction<CliDomainStream> = (iteration: CliDomainStream, ec?: ExecutionContextI) => {
  const log = new LoggerAdapter(ec, 're-cli', 'rule-cli', 'executeRulesEngineCLI');
  try {
    if (iteration) {
      log.info(`Text to parse: "${iteration.text}"`);
      let truVal = Rules.Engine.load(iteration.text, ec);
      if (isPromise(truVal)) {
        throw new Error('Asyc not yet supported in cli');
      } else {
        let [trueValue, parserMessages] = truVal;
        logParserMessages(parserMessages, ec);
        if (log.isInfoEnabled()) {
          log.debug(Rules.Engine, 'Rules.Engine');
        } else {
          log.info('Rules Engine loaded');
        }
        if (iteration.dataStream.length > 0) {
          log.info('Processing data stream');
        }
        iteration.dataStream.forEach(streamItem => {
          const truOrPromise = Rules.Engine.awaitEvaluation(streamItem.data, ec);
          if (isPromise(truOrPromise)) {
            throw new Error('Promises not yet implemented for Cli');
          } else {
            log.info(`Evaluating streaming item ${streamItem.description ? streamItem.description : '(no description)'}`);
            if (truOrPromise.valid === streamItem.expectedResult) {
              log.info(`Rules.Engine evaluates to ${truOrPromise} as expected`);
            } else {
              log.info(`Ruleset evaluates to ${truOrPromise} unexpectedly`);
            }
          }
        });
      }
    }
  } catch (err) {
    log.error(err);
  }
}


