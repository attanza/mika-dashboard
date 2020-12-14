import { Component, Vue } from 'vue-property-decorator';
import { getUserUrl } from '~/lib/apiUrls';

interface ErrorResponseData {
  isError: boolean;
  message: string;
  status: string;
  version: string;
}
@Component
export default class CatchErrorMixin extends Vue {
  userUrl = getUserUrl();
  catchError(error: any) {
    if (error.response) {
      const errResponse: ErrorResponseData = error.response.data;
      console.log('errResponse', errResponse);

      if (error.response.status === 400 || error.response.status === 403) {
        this.showSnackbar(error.response.data.message);
      }
      if (error.response.status === 401) {
        if (error.response.data.status === 'auth-401') {
          this.showSnackbar('your session is expired');
          // setTimeout(() => {
          //   this.$store.dispatch('logout');
          // }, 1000);
        }
        if (error.response.data.status === 'auth-421') {
          this.showSnackbar('Akun anda terblokir karena salah kata sandi sebanyak 6 kali');
          this.$store.dispatch('logout');
        }
      }
    } else if (error.request) {
      this.showSnackbar('Network Error');
    } else {
      this.showSnackbar(error.message);
    }
  }

  showSnackbar(message: string): void {
    this.$store.commit('SHOW_SNACKBAR', {
      show: true,
      text: message,
      color: 'error',
    });
  }
}
