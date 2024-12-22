import { Duration } from 'aws-cdk-lib';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { EventPattern, IEventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Architecture, Function as Lambda, LambdaInsightsVersion, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';

import { uncapitalize } from '../common/index.js';

export interface BaseNodejsFunctionDynamodbProps {
  readonly table: ITable;
  readonly grantWriteData?: boolean;
}

export interface BaseNodejsFunctionEventBridgeProps {
  readonly eventBus: IEventBus;
  readonly eventPattern?: EventPattern;
  readonly eventPatternDefaultEventBus?: boolean;
  readonly grantPutEvents?: boolean;
}

export interface BaseNodejsFunctionProps {
  readonly dynamodb?: BaseNodejsFunctionDynamodbProps;
  readonly eventBridge?: BaseNodejsFunctionEventBridgeProps;
  readonly nodejsFunctionProps?: NodejsFunctionProps;
}

const addDynamoDb = (fn: Lambda, props?: BaseNodejsFunctionDynamodbProps) => {
  const { table, grantWriteData } = props || {};

  if (!table) {
    return;
  }

  fn.addEnvironment('TABLE', table.tableName);

  if (grantWriteData) {
    table.grantReadWriteData(fn);
  } else {
    table.grantReadData(fn);
  }
};

const addEventBridge = (scope: Construct, id: string, fn: Lambda, props?: BaseNodejsFunctionEventBridgeProps) => {
  const { eventBus, eventPattern, eventPatternDefaultEventBus, grantPutEvents } = props ?? {};

  if (!eventBus) {
    return;
  }

  if (grantPutEvents) {
    fn.addEnvironment('EVENT_BUS_NAME', eventBus.eventBusName);
    eventBus.grantPutEventsTo(fn);
  }

  if (eventPattern) {
    new Rule(scope, `${id}EventRule`, {
      description: `${id} event rule`,
      ...(eventPatternDefaultEventBus ? {} : { eventBus }),
      eventPattern,
    }).addTarget(new LambdaFunction(fn));
  }
};

export class BaseNodejsFunction extends NodejsFunction {
  constructor(scope: Construct, id: string, props?: BaseNodejsFunctionProps) {
    const { dynamodb, eventBridge, nodejsFunctionProps } = props ?? {};

    super(scope, `${id}Function`, {
      // defaults
      architecture: Architecture.ARM_64,
      insightsVersion: LambdaInsightsVersion.VERSION_1_0_333_0,
      logRetention: RetentionDays.TWO_WEEKS,
      memorySize: 3008, // full capacity of a single cpu core for best single thread performance
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.minutes(1),
      tracing: Tracing.ACTIVE,
      // overrides
      ...nodejsFunctionProps,
      entry: resolve(findEntry(id, nodejsFunctionProps?.entry)),
      bundling: {
        // defaults
        banner: `import module from 'module'; if (typeof globalThis.require === "undefined") { globalThis.require = module.createRequire(import.meta.url); }`,
        format: OutputFormat.ESM,
        nodeModules: ['@smithy/protocol-http', '@smithy/service-error-classification', '@smithy/signature-v4'],
        sourceMap: true,
        // custom environment
        ...nodejsFunctionProps?.bundling,
      },
      environment: {
        LOG_LEVEL: 'ERROR',
        NODE_OPTIONS: '--enable-source-maps',
        POWERTOOLS_LOGGER_LOG_EVENT: 'false',
        POWERTOOLS_LOGGER_SAMPLE_RATE: '0',
        POWERTOOLS_METRICS_NAMESPACE: 'None',
        POWERTOOLS_SERVICE_NAME: id,
        POWERTOOLS_TRACE_ENABLED: 'true',
        POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'true',
        POWERTOOLS_TRACER_CAPTURE_ERROR: 'true',
        POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'true',
        ...nodejsFunctionProps?.environment,
      },
    });

    addDynamoDb(this, dynamodb);
    addEventBridge(scope, id, this, eventBridge);
  }
}

const findEntry = (id: string, customEntry = 'lambda'): string => {
  const definingDirname = dirname(findDefiningFile()).replace(/^file:\/\//, '');
  const handler = `${uncapitalize(id)}Handler`;

  const tsHandlerFile = join(definingDirname, customEntry, `${handler}.ts`);
  if (existsSync(tsHandlerFile)) {
    return tsHandlerFile;
  }

  const jsHandlerFile = join(definingDirname, customEntry, `${handler}.js`);
  if (existsSync(jsHandlerFile)) {
    return jsHandlerFile;
  }

  const mjsHandlerFile = join(definingDirname, customEntry, `${handler}.mjs`);
  if (existsSync(mjsHandlerFile)) {
    return mjsHandlerFile;
  }

  throw new Error(`Cannot find handler file ${tsHandlerFile}, ${jsHandlerFile} or ${mjsHandlerFile}`);
};

const findDefiningFile = (): string => {
  let definingIndex;
  const sites = callsites();
  for (const [index, site] of sites.entries()) {
    if (site.getFunctionName() === 'BaseNodejsFunction') {
      // The next site is the site where the BaseNodejsFunction was created
      definingIndex = index + 1;
      break;
    }
  }

  if (!definingIndex || !sites[definingIndex]) {
    throw new Error('Cannot find defining file.');
  }

  return sites[definingIndex].getFileName();
};

interface CallSite {
  getThis(): unknown;

  getTypeName(): string;

  getFunctionName(): string;

  getMethodName(): string;

  getFileName(): string;

  getLineNumber(): number;

  getColumnNumber(): number;

  getFunction(): unknown;

  getEvalOrigin(): string;

  isNative(): boolean;

  isToplevel(): boolean;

  isEval(): boolean;

  isConstructor(): boolean;
}

const callsites = (): CallSite[] => {
  const _prepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stackTraces) => stackTraces;
  const stack = new Error().stack?.slice(1);
  Error.prepareStackTrace = _prepareStackTrace;
  return stack as unknown as CallSite[];
};
