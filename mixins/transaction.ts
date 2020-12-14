import { snakeCase } from 'change-case';
import { Component, Mixins } from 'vue-property-decorator';
import { IDataTableHeader, IDropDownData, ITableFilter, ITableOptions } from '~/lib/interfaces';
import transactionFilter from './transactionFilter';
@Component
export default class TransactionMixin extends Mixins(transactionFilter) {
  /**
   * data:
   * 1. items: Array, items will be used in table retrieve from API
   * 2. total: Integer, total of items retrieved from API
   * 3. loading: Boolean, as indicator if process is in progress
   * 4. options: Object, will be use as pagination data for API
   * 4.1. getCount: Integer, to generate total count of retrieved resource from API
   * 4.2. itemsPerPage: Integer,
   * 4.3. sortBy: String, get data from API sorted by the sortBy
   * 4.4. sortDesc: String, get data from API sorted descending, if not sort it by ascending
   * 5. searchFilters: Array, will be use at search filter option in table filter
   */
  items = [];
  total = 0;
  loading = false;
  options = {
    getCount: 1,
    itemsPerPage: 25,
    sortBy: ['createdAt'],
    sortDesc: [true],
  } as ITableOptions;
  footerProps = {
    itemsPerPageOptions: [25, 50, 100, 250],
  };
  headers: IDataTableHeader[] = [];

  searchFilters: IDropDownData[] = [];

  /**
   * computed:
   * tableFilter: Object, variables will ne used by getQueries to generate request query
   */
  get tableFilter(): ITableFilter {
    return this.$store.state.tableFilter;
  }

  /**
   * getQueries:
   * to generate query request to be sent to API back end, eg: filtering, searching, etc
   */
  getQueries(): string {
    let query = '?';
    this.options.perPage = this.options.itemsPerPage;
    this.options.orderBy = this.options.sortBy[0];
    this.options.order = this.options.sortDesc[0] ? 'desc' : 'asc';

    let key: keyof ITableOptions;
    for (key in this.options) {
      query += `${snakeCase(key)}=${this.options[key]}&`;
    }

    const { searchFilter, operator, searchValue, dates } = this.tableFilter;
    if (searchFilter && searchValue) {
      query += `f[${searchFilter}]=${operator},${searchValue}&`;
    }
    if (dates && dates[0] != null && dates[0] != null) {
      query += `f[createdAt]=gte,${dates[0].toISOString()}&f[createdAt]=lte,${dates[1].toISOString()}&`;
    }
    return query;
  }

  /**
   * dateFilter: to shape the date string into certain date format
   */
  dateFilter(date: Date): string {
    return this.$moment(date).format('YYYY-MM-DD');
  }

  /**
   * timeFilter: to shape the date string into certain time format
   */
  timeFilter(date: Date): string {
    return this.$moment(date).format('HH:mm:ss');
  }

  /**
   * formatNumber: to format a number separated by comma
   */
  formatNumber(num: number): string {
    // return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
    });

    return formatter.format(num);
  }

  /**
   * setSearchFilter: to generate items to be used as searchFilters inside table filter
   */
  setSearchFilter(): void {
    if (this.headers && this.headers.length > 0) {
      this.headers.map(h => {
        if (h.value !== 'createdAt' && h.value !== 'time') {
          this.searchFilters.push({
            value: h.filterAs ? h.filterAs : h.value,
            text: h.text as string,
          });
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success':
        return 'success';

      case 'failed':
        return 'error';

      case 'created':
        return 'primary';

      default:
        return 'warning';
    }
  }
}
