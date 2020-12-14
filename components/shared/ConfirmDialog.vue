<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-title class="light-blue white--text">
        <v-icon class="white--text mr-3" dark>info</v-icon>
        {{ title }}
      </v-card-title>

      <v-divider></v-divider>
      <v-card-text>
        <h3 class="subtitle mt-3">{{ text }}</h3>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">No</v-btn>
        <v-btn color="primary" @click="confirm">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class ConfirmDialog extends Vue {
  @Prop({ type: Boolean, default: false }) readonly show!: boolean;
  @Prop({ type: String, required: false }) readonly title!: String;
  @Prop({ type: String, required: false }) readonly text!: String;

  dialog = false;

  @Watch('show', { immediate: true })
  onShowChange(): void {
    this.dialog = this.show;
  }
  close(): void {
    this.$emit('onClose');
  }
  confirm(): void {
    this.$emit('onConfirm');
  }
}
</script>
