<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="show"
      :timeout="timeout"
      absolute
      right
      shaped
      top
      :color="snackbar.color"
      transition="scroll-y-transition"
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="closeSnackbar" class="text-overline">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getters, RootState } from '~/store';
@Component
export default class SnackBarComponent extends Vue {
  show = false;
  timeout = 5000;

  get snackbar() {
    return (this.$store.state as RootState).snackbar;
  }

  @Watch('snackbar', { immediate: true })
  onSnackBarChange() {
    this.show = this.snackbar.show;
  }

  closeSnackbar() {
    this.$store.commit('SHOW_SNACKBAR', {
      show: false,
    });
  }
}
</script>
