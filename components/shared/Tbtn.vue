<template>
  <div>
    <v-tooltip :top="tooltipTop" :bottom="tooltipBottom">
      <template v-slot:activator="{ on }">
        <v-btn
          :color="color"
          :text="text"
          :block="block"
          :outlined="outline"
          :icon="iconMode"
          :title="title"
          :tooltip-text="tooltipText"
          :dark="dark"
          :loading="loading"
          :disabled="disabled"
          :small="smallBtn"
          v-on="on"
          @click="onClick"
        >
          <v-icon v-if="icon != ''">{{ icon }}</v-icon>
          <span v-if="title">{{ title }}</span>
        </v-btn>
      </template>
      <span v-if="tooltipText">{{ tooltipText }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Tbtn extends Vue {
  @Prop({ type: String, required: false, default: 'secondary' }) readonly color!: string;
  @Prop({ type: String, required: false, default: '' }) readonly icon!: string;
  @Prop({ type: String, required: false, default: '' }) readonly tooltipText!: string;
  @Prop({ type: String, required: false, default: '' }) readonly title!: string;
  @Prop({ type: Boolean, required: false, default: false }) readonly text!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly block!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly outline!: boolean;
  @Prop({ type: String, required: false, default: '' }) readonly iconMode!: string;
  @Prop({ type: Boolean, required: false, default: false }) readonly dark!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly loading!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly toolTip!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly tooltipTop!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly tooltipBottom!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly type!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly disabled!: boolean;
  @Prop({ type: Boolean, required: false, default: false }) readonly smallBtn!: boolean;

  onClick() {
    this.$emit('onClick');
  }
}
</script>

<style scoped></style>
