import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
Vue.component('bar-chart', {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
});
