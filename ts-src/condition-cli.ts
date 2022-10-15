import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {Scope} from '@franzzemen/re-common';
import {Condition, ConditionParser, ConditionScope} from '@franzzemen/re-condition';
import {isPromise} from 'node:util/types';
import {CliFunction, logParserMessages} from './cli-common.js';


export interface CliDomainData {
  description?: string;
  data: any;
  expectedResult: boolean
}

export interface CliDomainStream {
  text: string;
  dataStream: CliDomainData[];
}

export const executeConditionCLI: CliFunction<CliDomainStream> = (iteration: CliDomainStream, ec?: ExecutionContextI) => {
  const log = new LoggerAdapter(ec, 're-cli', 'condition-cli', 'executeExpressionCLI');
  try {
    if (iteration) {
      log.info(`Text to parse: "${iteration.text}"`);
      const scope: ConditionScope = new ConditionScope({}, undefined, ec);
      const parser: ConditionParser = scope.get(ConditionScope.ConditionParser);
      let [remaining, ref, parserMessages] = parser.parse(iteration.text, scope, ec);
      if(!scope.isResolved()) {
        const truVal = Scope.resolve(scope,ec);
        if(isPromise(truVal)) {
          throw new Error('Asyc not yet supported in cli');
        }
      }
      logParserMessages(parserMessages, ec);
      if(log.isInfoEnabled()) {
        if (ref) {
          log.debug(ref, 'Condition Reference');
        }
        if (remaining && remaining.trim().length > 0) {
          log.debug(`Remaining: ${remaining}`);
        }
      } else {
        log.info('Condition Reference Parsed');
      }
      const condition = new Condition(ref, scope, ec);
      log.debug(condition, 'Created condition');
      if(iteration.dataStream.length > 0) {
        log.info('Processing data stream')
      }
      iteration.dataStream.forEach(streamItem => {
        const truOrPromise = condition.awaitEvaluation(streamItem.data, scope, ec);
        if(isPromise(truOrPromise)) {
          throw new Error('Promises not yet implemented for Cli');
        } else {
          log.info(`Evaluating streaming item ${streamItem.description? streamItem.description : '(no description)'}`);
          if(truOrPromise === streamItem.expectedResult) {
            log.info(`Condition evaluates to ${truOrPromise} as expected`);
          }  else {
            log.info(`Condition evaluates to ${truOrPromise} unexpectedly`);
          }
        }
      })
    }
  } catch (err) {
    log.error(err);
  }
}


