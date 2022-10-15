import {ExecutionContextI, LoggerAdapter} from '@franzzemen/app-utility';
import {DataTypeFactory, DataTypeInferenceStackParser, DataTypeScope} from '@franzzemen/re-data-type';
import {CliFunction, logParserMessages} from './cli-common.js';




export interface DataTypeCliFormat {
  dataTypeRef?: string;
  text: string;
}

export const executeDataTypeCLI: CliFunction<DataTypeCliFormat> = (iteration: DataTypeCliFormat, ec?: ExecutionContextI) => {
  const log = new LoggerAdapter(ec, 're-cli', 'data-type-cli', 'executeDataTypeCLI');
  /*
  let dataRegex = /^(([a-zA-Z]+)[\s\t\r\n\v\f\u2028\u2029]+([a-zA-Z0-9.\-:]+|["']{1}[a-zA-Z0-9.\-:\s\t\r\n\v\f\u2028\u2029]+["']{1}))|([a-zA-Z0-9.\-:]+|["']{1}[a-zA-Z0-9.\-:\s\t\r\n\v\f\u2028\u2029]+["']{1})$/;
  let result2 = dataRegex.exec(iteration);
  let dataStr: string, dataTypeRef: string;
  if (result2[2]) {
    dataTypeRef = result2[2].trim();
    if (result2[3]) {
      dataStr = result2[3].trim();
    }
  } else if (result2[4]) {
    dataStr = result2[4].trim();
  } else {
    log.error('Inconsistent section, cannot determine data string');
    process.exit(8);
  }
  */
  let dataTypeRef = iteration.dataTypeRef;
  let dataStr = iteration.text;
  try {
    const scope: DataTypeScope = new DataTypeScope({}, undefined, ec);
    if (dataTypeRef) {
      const dataTypeFactory: DataTypeFactory = scope.get(DataTypeScope.DataTypeFactory);
      if (!dataTypeFactory.hasRegistered(dataTypeRef, ec)) {
        // TODO:  Account for custom types?  Or is that in Expression?
        log.warn(`Input data type ref ${dataTypeRef} does not exist, so ignoring and inferring`);
        dataTypeRef = undefined;
      } else {
        log.info(`Constraining to data type ${dataTypeRef}`);
      }
    }
    const parser = scope.get(DataTypeScope.DataTypeInferenceStackParser) as DataTypeInferenceStackParser;
    let [remaining, [value, parserRefName], parserMessages] = parser.parse(dataStr, scope, dataTypeRef, ec);
    logParserMessages(parserMessages, ec);
    if (value !== undefined) {
      log.info(`Data type is "${parserRefName}" with value ${parserRefName === 'Text' ? '\"' + value + '\"' : value}`);
    }
    if (remaining && remaining.trim().length > 0) {
      log.info(`Remaining: ${remaining}`);
    }
    if (value === undefined) {
      log.info('No parsable data type literal');
    }
  } catch (err) {
    log.error(err);
  }
};



