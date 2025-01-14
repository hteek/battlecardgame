import type { GeneratedQuery } from '@aws-amplify/api-graphql';
import { Hub } from 'aws-amplify/utils';

import { useNuxtApp } from 'nuxt/app';
import { Md5 } from 'ts-md5';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { graphql } from '../gql';
import type { CurrentUserQuery, CurrentUserQueryVariables, User } from '../gql/graphql';

import { useNotificationStore } from './notification';

const currentUser = graphql(/* GraphQL */ `
  query CurrentUser {
    currentUser {
      created
      email
      firstName
      id
      lastName
      disabled
      sub
      updated
      __typename
    }
  }
`);

const _get = async () =>
  useNuxtApp()
    .$Amplify.GraphQL.client.graphql({
      query: currentUser as unknown as GeneratedQuery<CurrentUserQueryVariables, CurrentUserQuery>,
    })
    .then((result) => result.data.currentUser as User);

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User>();
  const loading = ref(false);

  let currentUserListener: () => void;

  const currentUserNameOrEmail = computed(() =>
    currentUser.value?.firstName || currentUser.value?.lastName
      ? `${currentUser.value?.firstName ?? ''} ${currentUser.value?.lastName ?? ''}`
      : currentUser.value?.email,
  );

  const currentUserInitials = computed(
    () =>
      `${currentUser.value?.firstName?.charAt(0).toUpperCase() ?? ''}${
        currentUser.value?.lastName?.charAt(0).toUpperCase() ?? ''
      }`,
  );

  const hasCurrentUser = computed(
    () =>
      currentUser.value &&
      Object.keys(currentUser.value).length !== 0 &&
      Object.getPrototypeOf(currentUser.value) === Object.prototype,
  );

  const gravatarUrl = computed(() =>
    currentUser.value?.email
      ? `https://www.gravatar.com/avatar/${Md5.hashStr(currentUser.value?.email)}?d=404`
      : undefined,
  );

  async function login() {
    loading.value = true;
    await _get()
      .then((user) => {
        currentUser.value = user;
        Hub.dispatch('battlecardgame-auth', {
          event: 'user-sign-in',
          data: { userId: currentUser.value?.id },
          message: `User ${currentUser.value?.id} signed in`,
        });
      })
      .catch((err) => console.log(err));

    currentUserListener = Hub.listen('notification', async (data) => {
      const {
        data: { channel, id },
        message,
      } = data.payload as { data: { channel: string; id: string }; message: string };

      if (/MODIFY-User-(.*)/.test(message) && currentUser.value?.id === id && channel === 'user') {
        await get();
        useNotificationStore().notify({
          title: 'auth.notifications.update.success.title',
          description: 'auth.notifications.update.success.description',
          descriptionArgs: {
            firstName: currentUser.value?.firstName,
            lastName: currentUser.value?.lastName,
          },
        });
      }
    });
    loading.value = false;
  }

  async function logout() {
    if (currentUserListener) {
      currentUserListener();
    }
    currentUser.value = undefined;
  }

  async function get() {
    await _get()
      .then((user) => (currentUser.value = user))
      .catch((err) => console.log(err));
  }

  return {
    currentUser,
    currentUserNameOrEmail,
    currentUserInitials,
    get,
    gravatarUrl,
    hasCurrentUser,
    loading,
    login,
    logout,
  };
});
