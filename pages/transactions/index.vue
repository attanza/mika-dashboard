<template>
  <v-card>
    <table-filter
      :search-filters="searchFilters"
      :data-to-download="dataToDownload"
      @applyFilter="populateTable"
    />
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
        :footer-props="footerProps"
      >
        <template v-slot:item.id="{ item }">
          <v-btn @click="toDetail(item.id)" text color="primary">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ item.id.substring(0, 8) + '...' }}</span>
              </template>
              <span>{{ item.id }}</span>
            </v-tooltip>
          </v-btn>
        </template>
        <template v-slot:item.idAlias="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <span v-on="on">{{ item.idAlias.substring(0, 8) + '...' }}</span>
            </template>
            <span>{{ item.idAlias }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.amount="{ item }">
          {{
            item.amount
              | currency('', 2, {
                thousandsSeparator: '.',
                decimalSeparator: ',',
              })
          }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)">
            <span>{{ item.status }}</span>
          </v-chip>
        </template>
        <template v-slot:item.createdAt="{ item }">{{ dateFilter(item.createdAt) }}</template>
        <template v-slot:item.time="{ item }">{{ timeFilter(item.createdAt) }}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { getUserUrl } from '~/lib/apiUrls';
import transaction from '~/mixins/transaction';
import TableFilter from '~/components/shared/TableFilter.vue';
import tableHeaders from '~/lib/tableHeaders';
import { getUserType } from '~/lib/apiUrls';
import fetchApi from '~/lib/fetchApi';
import { IApiDbData } from '~/lib/interfaces';

@Component({
  components: { TableFilter },
})
export default class TransactionsPage extends Mixins(transaction) {
  items = [];
  dataToDownload = [];

  mounted() {
    this.$store.dispatch('clearTableFilter');
    this.setTableHeaders();
    this.populateTable();
    this.setSearchFilter();
  }

  async populateTable(): Promise<void> {
    try {
      const queries = this.getQueries();
      this.loading = true;
      const url = `${this.userUrl}/transactions${queries}`;
      const resp = await this.$axios.$get(url);
      this.total = resp.meta ? resp.meta.totalCount : 0;
      this.items = resp.data;
      // this.dataToDownload = parseDataToDownload('merchant', this.items);
      this.loading = false;
    } catch (error) {
      this.catchError(error);
    }
  }

  /**
   * Set table header from user type
   */
  setTableHeaders() {
    this.headers = [...tableHeaders[getUserType()]];
  }

  toDetail(id: string) {
    this.$router.push(`/transactions/${id}`);
  }
}
</script>
