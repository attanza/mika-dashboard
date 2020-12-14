<template>
  <v-container fluid fill-height class="main-bg">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <div class="mx-auto rounded-lg elevation-12 d-flex" style="width: 80vw; overflow: hidden">
          <div class="white py-10 px-10" style="min-width: 50%">
            <div class="d-flex flex-column justify-center align-center">
              <div>
                <v-img src="/img/mika_logo_1.jpg" width="60"></v-img>
              </div>
              <div class="mt-4">
                <h3 style="color: #29A3DD">MIKA Dashboard System</h3>
              </div>
            </div>
            <div class="mt-4">
              <h2>Selamat Datang</h2>
              <p class="subtitle-2 grey--text text--darken-1">Silahkan Login terlebih daulu</p>
            </div>
            <div class="mt-3">
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  label="Username"
                  type="text"
                  v-model="username"
                  outlined
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  id="password"
                  type="password"
                  v-model="password"
                  outlined
                ></v-text-field>
                <v-btn block color="primary" @click="submit" :loading="loading">Login</v-btn>
              </v-form>
            </div>
            <div class="mt-4">
              <p class="text-center subtitle-2">
                © 2019 PT. Mika Informatika Indonesia.
                <br />All Rights Reserved.
              </p>
            </div>
          </div>
          <div class="right-bg"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { EUserTypes } from '~/lib/enums';
import fetchApi from '~/lib/fetchApi';
import { ILoginData, IMikaResponse } from '~/lib/interfaces';
import CatchErrorMixin from '~/mixins/catchError';

interface ILoginResponse extends IMikaResponse {
  data: ILoginData;
}

interface ILoginPostData {
  username: string;
  password: string;
  userTypes: Array<EUserTypes>;
}

@Component({
  layout: 'nonav',
})
export default class LoginPage extends Mixins(CatchErrorMixin) {
  username = '';
  password = '';
  loading = false;

  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.username = 'merchantStaff2';
      this.password = 'merchantStaff2';
    }
  }

  async submit() {
    if (this.username !== '' && this.password !== '') {
      try {
        this.loading = true;
        const data: ILoginPostData = {
          username: this.username,
          password: this.password,
          userTypes: [EUserTypes.merchantStaff, EUserTypes.acquirerStaff],
        };
        const resp = await this.$axios.$post('/auth/login', data);
        await this.$store.dispatch('setAuth', resp.data);
        this.$router.push('/');
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log('login error');
        this.catchError(error);
      }
    }
  }
}
</script>
<style lang="css">
.main-bg {
  background-image: url('/img/login_bg.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.right-bg {
  background-image: url('/img/login_right_bg.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-width: 50%;
}
@media only screen and (max-width: 768px) {
  .right-bg {
    display: none;
  }
}
</style>
