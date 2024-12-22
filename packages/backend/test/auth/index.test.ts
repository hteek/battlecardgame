import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

import { AuthStack } from '../../lib/auth/index.js';

import { domainName, hostedZoneId, projectId, tableName } from '../data/index.js';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) =>
    `"${(val as string)
      .replace(/([A-Fa-f0-9]{64})\.(json|zip)|(SsrEdgeFunctionCurrentVersion[A-Fa-f0-9]{40})/, '[FILENAME REMOVED]')
      .replace(
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
        '[VERSION REMOVED]',
      )}"`,
});

describe('Auth nested stack', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterEach(() => {
    process.env = OLD_ENV; // restore old env
  });

  test('Test default stack', async () => {
    process.env['AMAZON_CLIENT_SECRET'] = 'wvä,wlöjvp31jvpij30vj3ijv009u3092i4hjt3njndsjlcvnbwh983c';
    process.env['FACEBOOK_CLIENT_SECRET'] = '9782037423fjkwbfjkwbkfvb33';
    process.env['GOOGLE_CLIENT_SECRET'] = 'dv,lkvpo3j904ujc23j93';
    process.env['BATTLE_CARD_GAME_OIDC_CLIENT_SECRET'] = 'löjvp31jvpij30vj3ijv009u3092i4hjt3njndsjlcvnbwh983c';

    const stack = new Stack(new App(), 'TestStack');
    const nestedStack = new AuthStack(stack, 'Auth', {
      config: {
        certificate: Certificate.fromCertificateArn(
          stack,
          'Certificate',
          'arn:aws:acm:us-east-1:account:certificate/certificate_id',
        ),
        domainName,
        hostedZoneId,
        identityProviders: {
          amazon: {
            clientId: 'amzn1.application-oa2-client.387208372fjwhefjhwelf3',
          },
          facebook: {
            clientId: '7823748923749873294',
          },
          google: {
            clientId: '324234234241-8734gfkwgecg3479r2379rzf.apps.googleusercontent.com',
          },
          oidc: [
            {
              clientId: 'oidc.oidc.client.387208372fjwhefjhwelf3',
              issuerUrl: 'https://oidc.issuer.url',
              providerName: 'BattleCardGameOIDC',
            },
          ],
          saml: [
            {
              metadataUrl:
                'https://login.microsoftonline.com/02ir93ovhoi3hv8vnoi3nvr/federationmetadata/2007-06/federationmetadata.xml',
              providerName: 'BattleCardGameSAML',
            },
          ],
        },
        table: Table.fromTableName(stack, 'TestTable', tableName),
        useSes: true,
      },
      projectId,
    });
    expect(Template.fromStack(nestedStack).toJSON()).toMatchSnapshot();
  });
});
