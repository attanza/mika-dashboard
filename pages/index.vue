<template>
  <div>
    <v-sheet elevation="1" class="pa-5" shaped>
      <h3 class="subtitle-1">Filter:</h3>
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="outletId"
            item-text="name"
            item-value="id"
            :items="outlets"
            label="Outlet"
            cache-items
            clearable
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="agentId"
            item-text="name"
            item-value="id"
            :items="agents"
            label="Outlet"
            clearable
          />
        </v-col>
        <v-col cols="12" md="6">
          <date-picker
            v-model="dates"
            range
            :shortcuts="shortcuts"
            lang="en"
            width="100%"
            class="mt-3"
          ></date-picker>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn color="primary" @click="applyFilter()">Apply</v-btn>
        </v-col>
      </v-row>
    </v-sheet>

    <v-sheet elevation="1" class="pa-5 mt-5" shaped>
      <h3 class="subtitle-1">Transactions Summary</h3>
      <v-row v-if="successTransaction">
        <v-col cols="12" md="3">
          <v-card color="brown darken-2" dark flat>
            <v-card-title>
              {{ successTransaction.count }}
            </v-card-title>
            <v-card-subtitle> Transactions Total </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange darken-2" dark flat>
            <v-card-title>
              {{
                successTransaction.amount
                  | currency('IDR ', 2, {
                    thousandsSeparator: '.',
                    decimalSeparator: ',',
                  })
              }}
            </v-card-title>
            <v-card-subtitle> Transactions Amount Total </v-card-subtitle>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green darken-2" dark flat>
            <v-card-title>
              {{
                successTransaction.nettAmount
                  | currency('IDR ', 2, {
                    thousandsSeparator: '.',
                    decimalSeparator: ',',
                  })
              }}
            </v-card-title>
            <v-card-subtitle> Transactions Nett Amount </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet elevation="1" class="pa-5 mt-5" shaped>
      <h3 class="subtitle-1">Summary of {{ $moment().format('YYYY') }} Transactions</h3>
      <v-row v-if="chartData">
        <v-col>
          <bar-chart :chart-data="chartData" :options="options" />
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { getUserUrl } from '~/lib/apiUrls';
import fetchApi from '~/lib/fetchApi';
import { IApiDbData, IChartData, IStatisticTransaction } from '~/lib/interfaces';
import catchError from '~/mixins/catchError';
import datePickerShortcut from '~/mixins/datePickerShortcut';

@Component
export default class DashboardPage extends Mixins(catchError, datePickerShortcut) {
  chartData: IChartData | null = null;
  options = {
    responsive: true,
    maintainAspectRatio: false,
  };
  currentTransaction = null;
  outletId = null;
  agentId = null;
  outlets: IApiDbData[] = [];
  agents: IApiDbData[] = [];
  successTransaction = {
    count: 0,
    amount: 0,
    nettAmount: 0,
  };
  dates = null;
  shortcuts = this.generateShortcut();

  @Watch('outletId')
  onOutletIdChange() {
    if (this.outletId) {
      this.getAgents();
    }
  }
  mounted() {
    this.getOulets();
    this.getTransactions();
    this.getStatistic();
  }

  async getOulets() {
    try {
      const url = `${this.userUrl}/outlets?order=asc&order_by=name`;
      const resp = await this.$axios.$get(url);
      const apiData: IApiDbData[] = resp.data;
      apiData.map(d =>
        this.outlets.push({
          id: d.id,
          name: d.name,
        })
      );
    } catch (error) {
      console.log('getOulets error');
      this.catchError(error);
    }
  }
  async getAgents() {
    try {
      const filter = `f[outletId]=eq,${this.outletId}`;
      const url = `${this.userUrl}/agents?order=asc&order_by=name&${filter}`;
      const resp = await this.$axios.$get(url);
      const apiData: IApiDbData[] = resp.data;

      apiData.map(d =>
        this.agents.push({
          id: d.id,
          name: d.name,
        })
      );
    } catch (e) {
      console.log('getAgents error');
      this.catchError(e);
    }
  }
  async getTransactions() {
    try {
      let filter = '';
      if (this.outletId) filter = `f[agent.outletId]=eq,${this.outletId}`;
      if (this.agentId) filter = `f[agentId]=eq,${this.agentId}`;
      // if (this.dates != null && this.dates[0] != null && this.dates[1] != null) {
      //   filter += `&f[createdAt]=gte,${this.$moment(this.dates[0])
      //     .startOf('day')
      //     .utc()
      //     .format()}&f[createdAt]=lte,${this.$moment(this.dates[1])
      //     .endOf('day')
      //     .utc()
      //     .format()}`;
      // }
      const url = `${getUserUrl()}/statistic/transaction/success?${filter}`;
      const resp = await this.$axios.$get(url);
      this.successTransaction.count = resp.data.transactionCount || 0;
      this.successTransaction.amount = resp.data.totalAmount || 0;
      this.successTransaction.nettAmount = resp.data.totalNettAmount || 0;
    } catch (e) {
      console.log('getTransactions error');
      this.catchError(e);
    }
  }
  async getStatistic() {
    try {
      let filter = '';
      if (this.outletId) filter = `f[agent.outletId]=eq,${this.outletId}`;
      if (this.agentId) filter = `f[agentId]=eq,${this.agentId}`;
      const url = `${getUserUrl()}/statistic_by_time/transaction/success?${filter}`;

      const resp = await this.$axios.$get(url);
      const apiData: IStatisticTransaction[] = resp.data;
      const data: string[] = [];
      const labels: string[] = [];
      apiData.map(d => {
        data.push(d.totalNettAmount.toLocaleString());
        labels.push(this.$moment(d.createdAt).format('MMM'));
      });
      const datasets = [
        {
          label: `Nett Transactions Year of ${this.$moment().format('YYYY')}`,
          backgroundColor: '#29A3DD',
          data: data,
        },
      ];
      this.chartData = {
        labels,
        datasets,
      };
    } catch (e) {
      console.log('getStatistic error');
      this.catchError(e);
    }
  }
  applyFilter() {
    this.getTransactions();
    this.getStatistic();
  }
}
</script>
