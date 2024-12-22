import type { GeneratedSubscription } from '@aws-amplify/api-graphql';
import { Hub } from 'aws-amplify/utils';

import { defineStore } from 'pinia';
import { filter } from 'remeda';
import type { Subscription } from 'rxjs';
import { ref } from 'vue';

import { graphql } from '../gql';

import { useAuthStore } from './auth';
import type {
  Notification,
  OnNotificationSubscription,
  OnNotificationSubscriptionVariables,
  OnUserNotificationSubscription,
  OnUserNotificationSubscriptionVariables,
} from '../gql/graphql';
import type { NotificationAction } from '#ui/types';

interface UserNotification {
  description?: string;
  descriptionArgs?: Record<string, unknown>;
  isNew: boolean;
  receivedAt: Date;
  title: string;
  titleArgs?: Record<string, unknown>;
  type: 'info' | 'error';
}

const onNotification = graphql(/* GraphQL */ `
  subscription OnNotification {
    onNotification {
      action
      entity
      id
      referenceId
      userId
      __typename
    }
  }
`);

const onUserNotification = graphql(/* GraphQL */ `
  subscription OnUserNotification($userId: ID!) {
    onUserNotification(userId: $userId) {
      action
      entity
      id
      referenceId
      userId
      __typename
    }
  }
`);

const subscribeNotification = async (onCreate: (value: Notification) => void) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: onNotification as unknown as GeneratedSubscription<
        OnNotificationSubscriptionVariables,
        OnNotificationSubscription
      >,
    })
    .subscribe({
      next: ({ data }) => onCreate(data.onNotification as unknown as Notification),
      error: (error) => console.warn(error),
    });

const subscribeUserNotification = async (userId: string, onCreate: (value: Notification) => void) =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: onUserNotification as unknown as GeneratedSubscription<
        OnUserNotificationSubscriptionVariables,
        OnUserNotificationSubscription
      >,
      variables: { userId },
    })
    .subscribe({
      next: ({ data }) => onCreate(data.onUserNotification as unknown as Notification),
      error: (error) => console.warn(error),
    });

export const useNotificationStore = defineStore('notification', () => {
  const { t } = useNuxtApp().$i18n;
  const toast = useToast();

  const initialized = ref(false);

  const notificationSubscription = ref<Subscription | void>(); // eslint-disable-line @typescript-eslint/no-invalid-void-type
  const userNotificationSubscription = ref<Subscription | void>(); // eslint-disable-line @typescript-eslint/no-invalid-void-type

  const notifications = ref<UserNotification[]>([]);

  const newNotifications = computed(() => filter(notifications.value, (notification) => notification.isNew).length);

  const registerSubscriptions = async () => {
    const authStore = useAuthStore();
    if (authStore.currentUser) {
      notificationSubscription.value?.unsubscribe();
      notificationSubscription.value = await subscribeNotification(async (value) => {
        const { action, entity, id, referenceId, userId } = value;
        Hub.dispatch('notification', {
          event: 'entity changed',
          data: { action, channel: 'system', entity, id, referenceId, userId },
          message: `${action}-${entity}-${id}`,
        });
      }).catch((e) => console.error(e));

      userNotificationSubscription.value?.unsubscribe();
      userNotificationSubscription.value = await subscribeUserNotification(authStore.currentUser.id, async (value) => {
        const { action, entity, id, referenceId, userId } = value;
        Hub.dispatch('notification', {
          event: 'entity changed',
          data: { action, channel: 'user', entity, id, referenceId, userId },
          message: `${action}-${entity}-${id}`,
        });
      }).catch((e) => console.log(e));
    }
  };

  async function init() {
    if (!initialized.value) {
      initialized.value = true;
      await registerSubscriptions();

      Hub.listen('battlecardgame-auth', async (data) => {
        const {
          payload: { event },
        } = data;
        switch (event) {
          case 'user-sign-in':
            await registerSubscriptions();
            break;
        }
      });

      Hub.listen('auth', (data) => {
        const {
          payload: { event },
        } = data;
        switch (event) {
          case 'signedOut':
            notificationSubscription.value?.unsubscribe();
            userNotificationSubscription.value?.unsubscribe();
            break;
        }
      });
    }
  }

  function notify(props: {
    actions?: NotificationAction[];
    title: string;
    titleArgs?: Record<string, unknown>;
    description?: string;
    descriptionArgs?: Record<string, unknown>;
  }) {
    notifications.value.unshift({
      ...props,
      isNew: true,
      receivedAt: new Date(),
      type: 'info',
    });
    const { actions, description, descriptionArgs, title, titleArgs } = props;
    toast.add({
      ...(description ? { description: t(description, descriptionArgs ?? {}) } : {}),
      icon: 'i-heroicons-check-circle',
      title: t(title, titleArgs ?? {}),
      actions,
    });
  }

  function error(props: {
    title: string;
    titleArgs?: Record<string, unknown>;
    description: string;
    descriptionArgs?: Record<string, unknown>;
  }) {
    notifications.value.unshift({
      ...props,
      isNew: true,
      receivedAt: new Date(),
      type: 'error',
    });
    const { description, descriptionArgs, title, titleArgs } = props;
    toast.add({
      color: 'red',
      description: t(description, descriptionArgs ?? {}),
      icon: 'i-heroicons-x-circle',
      title: t(title, titleArgs ?? {}),
    });
  }

  return {
    error,
    init,
    newNotifications,
    notifications,
    notify,
  };
});
