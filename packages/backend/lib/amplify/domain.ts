import { CfnDomain } from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';

export interface InnovatorAmplifyDomainProps {
  readonly appId: string;
  readonly branchName: string;
  readonly certificate: ICertificate;
  readonly domainName: string;
}

export class Domain extends CfnDomain {
  constructor(scope: Construct, props: InnovatorAmplifyDomainProps) {
    const { appId, branchName, certificate, domainName } = props;
    super(scope, 'AmplifyDomain', {
      appId,
      domainName,
      certificateSettings: {
        certificateType: 'CUSTOM',
        customCertificateArn: certificate.certificateArn,
      },
      enableAutoSubDomain: false,
      subDomainSettings: [{ branchName, prefix: '' }],
    });
  }
}
