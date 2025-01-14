export default {
  amplify: {
    branchName: 'main',
    monorepoAppRoot: 'packages/frontend',
  },
  auth: {
    callbackUrls: ['http://localhost:3000/login'],
    identityProviders: {
      amazon: {
        clientId: 'amzn1.application-oa2-client.52287ca2998d4c0ba1a6e3d6478d37ad',
      },
      google: {
        clientId: '211145703742-r1kt05na6f6t1hqf9g3una5daflue3e6.apps.googleusercontent.com',
      },
    },
    logoutUrls: ['http://localhost:3000/logout'],
    selfSignUpEnabled: true,
  },
  domainName: 'battlecardgame.net',
  github: {
    owner: 'hteek',
    repo: 'battlecardgame',
  },
  hostedZoneId: 'Z00789951VPW5G0025TO5',
  project: 'battle-card-game',
};
