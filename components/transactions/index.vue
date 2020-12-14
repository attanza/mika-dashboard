<template>
  <v-card flat class="mt-5">
    <table-filter :search-filters="searchFilters" :data-to-download="dataToDownload" @applyFilter="populateTable" />
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
          <span class="link" @click="toDetail(item.id)">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ item.id.substring(0, 8) + '...' }}</span>
              </template>
              <span>{{ item.id }}</span>
            </v-tooltip>
          </span>
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

<script>
import { transaction } from '~/mixins';
import parseDataToDownload from '~/lib/parseDataToDownload';
import debounce from 'lodash/debounce';
import tableFilter from '~/components/commons/tableFilter';
import tableHeaders from '~/lib/tableHeaders';
import userUrl from '~/lib/userUrl';
export default {
  /**
   * components:
   * tableFilter: separate component to display table filtering
   */
  components: { tableFilter },

  /**
   * mixins:
   */
  mixins: [transaction],

  /**
   * data:
   * 1. headers: Array, to generate table header
   * 2. filterSelectable: Array, as reference on table filter's will be using select input or text input
   * 3. dataToDownload: Array, shaped json data to be exported to csv
   */
  data: () => ({
    headers: [],
    dataToDownload: [],
  }),

  /**
   * watchs:
   * 1. options: to watch options variable (@mixin/transaction) to fetch data from back end API
   * 2. selectedFilterBy: to watch selectedFilterBy, then populate filter value in the tableFilter component
   */
  watch: {
    options: {
      handler: debounce(function () {
        this.populateTable();
      }, 500),
      deep: true,
    },
    selectedFilterBy() {
      if (this.selectedFilterBy) {
        this.getFilterValues(this.selectedFilterBy.value);
      }
    },
  },

  /**
   * mounted:
   * clearTableFilter: to clear out table filter state
   * populateTable: get data from back end API
   * setSearchFilter: located @mixins/transaction
   */
  mounted() {
    this.$store.commit('clearTableFilter');
    const userType = window.localStorage.getItem('userType');
    this.headers = tableHeaders[userType];
    this.populateTable();
    this.setSearchFilter();
  },

  methods: {
    /**
     * populateTable: get data from API and populate them into table
     */
    async populateTable() {
      try {
        this.loading = true;
        const queries = this.getQueries();
        const resp = await this.$axios.$get(`${userUrl()}/transactions${queries}`);
        this.total = resp.meta ? resp.meta.totalCount : 0;
        this.items = resp.data;
        this.dataToDownload = parseDataToDownload('merchant', this.items);

        this.loading = false;
      } catch (e) {
        this.catchError(e, this.$auth, this.$router);
      }
    },

    /**
     * toDetail: navigate to detail page
     */
    toDetail(id) {
      this.$router.push(`/transactions/${id}`);
    },
  },
};
</script>
