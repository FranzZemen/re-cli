import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {Application, ApplicationParser, ApplicationScope} from '@franzzemen/re-application';
import {Scope} from '@franzzemen/re-common';
import {Rule, RuleParser, RuleScope} from '@franzzemen/re-rule';
import {RuleSet, RuleSetParser, RuleSetScope} from '@franzzemen/re-rule-set';
import {isPromise} from 'node:util/types';
import {CliFunction, logParserMessages} from './cli-common.js';
import {CliDomainStream} from './condition-cli.js';

export const executeApplicationCLI: CliFunction<CliDomainStream> = (iteration: CliDomainStream, ec?: ExecutionContextI) => {
  const log = new LoggerAdapter(ec, 're-cli', 'rule-cli', 'executeApplicationCLI');
  try {
    if (iteration) {
      log.info(`Text to parse: "${iteration.text}"`);
      let scope: ApplicationScope = new ApplicationScope({}, undefined, ec);
      const parser: ApplicationParser = scope.get(ApplicationScope.ApplicationParser);
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
          log.debug(ref, 'Applicatoin reference');
        }
        if (remaining && remaining.trim().length > 0) {
          log.debug(`Remaining: ${remaining}`);
        }
      } else {
        log.info('Application reference parsed');
      }
      const app = new Application(ref, scope, ec);
      log.debug(app, 'Created application');
      if (iteration.dataStream.length > 0) {
        log.info('Processing data stream');
      }
      iteration.dataStream.forEach(streamItem => {
        const truOrPromise = app.awaitEvaluation(streamItem.data);
        if (isPromise(truOrPromise)) {
          throw new Error('Promises not yet implemented for Cli');
        } else {
          log.info(`Evaluating streaming item ${streamItem.description ? streamItem.description : '(no description)'}`);
          if (truOrPromise.valid === streamItem.expectedResult) {
            log.info(`Application evaluates to ${truOrPromise} as expected`);
          } else {
            log.info(`Application evaluates to ${truOrPromise} unexpectedly`);
          }
        }
      });
    }
  } catch (err) {
    log.error(err);
  }
};


