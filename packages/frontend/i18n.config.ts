export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  defaultLocale: 'en',
  messages: {
    en: {
      auth: {
        login: {
          signOut: {
            action: 'Sign out',
          },
        },
      },
      game: {
        continue: '...or join an existing one!',
        create: 'Create new game!',
        existing: 'Existing games',
        invitation: {
          label: 'Opponents Email',
          description: 'Your opponent needs to have an account on this platform!',
        },
        login: 'Login to create a game!',
        notifications: {
          create: {
            failed: {
              description: 'Error: {error}',
              title: 'Game could not be created',
            },
          },
          invitation: {
            success: {
              title: 'Game invitation received from {email}',
            },
          },
        },
        title: 'Viking Raid',
        description:
          'Lead you army of vikings to victory against your opponent! Viking Raid is our initial card deck on this platform. Enjoy!!',
        you: 'You',
      },
    },
  },
}));
