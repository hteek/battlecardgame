import { Stack } from 'aws-cdk-lib';
import { IHostedZone, MxRecord, TxtRecord } from 'aws-cdk-lib/aws-route53';
import { EmailIdentity, Identity, ReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
import { Bounce, BounceTemplate } from 'aws-cdk-lib/aws-ses-actions';
import { Construct } from 'constructs';

export interface BaseSesProps {
  readonly domainName: string;
  readonly hostedZone: IHostedZone;
}

export class BaseSes extends Construct {
  constructor(scope: Construct, props: BaseSesProps) {
    super(scope, 'Ses');

    const { domainName, hostedZone } = props;

    const emailIdentity = new EmailIdentity(scope, 'EmailIdentity', {
      identity: Identity.publicHostedZone(hostedZone),
    });

    const receiptRuleSet = new ReceiptRuleSet(scope, 'ReceiptRuleSet', {
      rules: [
        {
          recipients: [`no-reply@${domainName}`],
          actions: [
            new Bounce({
              sender: `no-reply@${domainName}`,
              template: BounceTemplate.MAILBOX_DOES_NOT_EXIST,
            }),
          ],
        },
      ],
    });
    receiptRuleSet.node.addDependency(emailIdentity);

    new MxRecord(scope, 'MxRecord', {
      zone: hostedZone,
      recordName: domainName,
      values: [
        {
          priority: 10,
          hostName: `inbound-smtp.${Stack.of(scope).region}.amazonaws.com`,
        },
      ],
    });

    new TxtRecord(scope, 'DmarcRecord', {
      zone: hostedZone,
      recordName: `_dmarc.${domainName}`,
      values: [`v=DMARC1;p=quarantine;rua=mailto:dmarc_report@${domainName}`],
    });
  }
}
