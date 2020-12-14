<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>
          <v-img src="/img/logo_horizontal_putih.png" width="100px"></v-img>
        </v-toolbar-title>
      </v-toolbar>
      <v-list dense>
        <v-list-item v-for="item in sideMenus" :key="item.label" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="!drawer">
        <v-img src="/img/logo_horizontal_putih.png" width="100px"></v-img>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn dark text v-on="on">{{ user ? user.name : '' }}</v-btn>
          </template>
          <v-list>
            <v-list-item @click="showChangePasswordForm = !showChangePasswordForm">
              <v-list-item-title>Change Password</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="showConfirm = true">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <v-container fluid>
      <v-main>
        <client-only>
          <nuxt />
          <snackbar></snackbar>
          <!-- <change-password-form :show="showChangePasswordForm" @onClose="showChangePasswordForm = false" /> -->
          <confirm-dialog
            title="Logout"
            text="Are you sure ?"
            :show="showConfirm"
            @onClose="showConfirm = false"
            @onConfirm="logout"
          />
        </client-only>
      </v-main>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import Snackbar from '~/components/shared/Snackbar.vue';
import ConfirmDialog from '~/components/shared/ConfirmDialog.vue';
import { Context } from '@nuxt/types';
import { getUserUrl } from '~/lib/apiUrls';
import catchError from '~/mixins/catchError';
import { IAuth, IUser } from '~/lib/interfaces';
import fetchApi from '~/lib/fetchApi';
@Component({
  components: { Snackbar, ConfirmDialog },
})
export default class LayoutPage extends Mixins(catchError) {
  drawer = false;
  showChangePasswordForm = false;
  showConfirm = false;
  sideMenus = [
    { label: 'Dashboard', icon: 'dashboard', to: '/' },
    { label: 'Transactions', icon: 'swap_calls', to: '/transactions' },
    { label: 'Settlements', icon: 'gavel', to: '/settlements' },
  ];

  get user(): IUser | null {
    const auth = this.$store.state.auth;
    if (auth) {
      return auth.user;
    }
    return null;
  }

  async beforeMount() {
    try {
      if (!this.user) {
        const resp = await fetchApi(this.userUrl);
        const auth: IAuth = {
          user: {
            id: resp.data.id,
            name: resp.data.name,
            email: resp.data.email,
            merchantId: resp.data.merchantId,
          },
        };
        this.$store.commit('SET_AUTH', auth);
      }
    } catch (error) {
      this.catchError(error);
    }
  }

  logout(): void {
    this.$store.dispatch('logout');
  }
}
</script>
