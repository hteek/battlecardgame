import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { BaseDnsValidatedCertificate } from './certificate.js';
import { BaseEventBus } from './eventbus.js';
import { BasePipe } from './pipe/index.js';
import { BaseSes } from './ses.js';
import { BaseTable } from './table.js';

/**
 * Configuration options for {@linkcode BaseStack}.
 */
export interface BaseConfig {
  readonly domainName: string;
  readonly hostedZoneId: string;
  readonly useSes?: boolean;
}

/**
 * Wrapper for {@linkcode NestedStackProps} to provide additional attributes.
 */
export interface BaseStackProps extends NestedStackProps {
  /**
   * Configuration of the {@linkcode BaseStack}.
   */
  readonly config: BaseConfig;
  readonly projectId: string;
}

/**
 * The base {@linkcode NestedStack} provides cross-cutting resources to be used in other stacks.
 */
export class BaseStack extends NestedStack {
  readonly certificate: ICertificate;
  readonly eventBus: IEventBus;
  readonly pipe: CfnPipe;
  readonly table: ITable;

  /**
   * @param scope The scope in which to define this construct.
   * @param id The scoped construct ID.
   * @param props The base stack properties.
   */
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    const {
      config: { domainName, hostedZoneId, useSes = false },
      projectId,
    } = props;

    this.table = new BaseTable(this, { tableName: projectId });
    this.eventBus = new BaseEventBus(this, { eventBusName: projectId });

    this.pipe = new BasePipe(this, {
      table: this.table,
      eventBus: this.eventBus,
      pipeName: projectId,
    });

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    });

    this.certificate = new BaseDnsValidatedCertificate(this, 'Certificate', {
      domainName,
      hostedZone,
    });

    if (useSes) {
      new BaseSes(this, {
        domainName,
        hostedZone,
      });
    }
  }
}
