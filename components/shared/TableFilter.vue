<template>
  <v-card-title>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-select
            id="searchFilter"
            v-model="searchFilter"
            :items="searchFilters"
            label="Search filter"
            cache-items
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            id="operators"
            v-model="operator"
            :items="operators"
            label="Select operator"
            item-text="text"
            item-value="value"
            cache-items
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <div v-if="searchValues.length > 0">
            <v-select
              id="searchValueSelect"
              v-model="searchValue"
              :items="searchValues"
              label="Select search value"
              item-text="text"
              item-value="value"
            ></v-select>
          </div>
          <div v-else>
            <v-text-field
              id="searchValue"
              v-model="searchValue"
              label="Search value"
            ></v-text-field>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <date-picker
            v-model="dates"
            range
            :shortcuts="shortcuts"
            lang="en"
            width="100%"
            class="mt-3"
          ></date-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-toolbar flat>
            <v-toolbar-title v-if="totalSettlement">
              {{
                totalSettlement
                  | currency('IDR ', 2, {
                    thousandsSeparator: '.',
                    decimalSeparator: ',',
                  })
              }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <Tbtn
              text
              tooltip-top
              icon="clear"
              tooltip-text="Clear filter"
              @onClick="clearFilter"
            />
            <Tbtn
              text
              tooltip-top
              icon="cloud_download"
              tooltip-text="Export to csv"
              @onClick="showConfirmDialog = true"
            />
            <Tbtn
              text
              tooltip-top
              icon="check"
              tooltip-text="Apply filter"
              :disabled="btnDisabled"
              @onClick="applyFilter"
            />
          </v-toolbar>
        </v-col>
      </v-row>
      <confirmDialog
        :show="showConfirmDialog"
        title="Export to csv"
        @onClose="showConfirmDialog = false"
        @onConfirm="download"
      ></confirmDialog>
    </v-container>
  </v-card-title>
</template>

<script lang="ts">
import { Mixins, Component, Prop, Watch } from 'vue-property-decorator';
import transactionFilter from '~/mixins/transactionFilter';
import datePickerShortcut from '~/mixins/datePickerShortcut';
import Tbtn from './Tbtn.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import { IDropDownData } from '~/lib/interfaces';
// import { ExportToCsv } from 'export-to-csv';

@Component({
  components: { Tbtn, ConfirmDialog },
})
export default class TableFilter extends Mixins(transactionFilter, datePickerShortcut) {
  // mixins: [transactionFilter, datePickerShortcut],
  /**
   * props:
   * searchFilter: Array of string to be used as items inside #searchFilter
   */
  @Prop({ type: Array, required: true }) readonly searchFilters!: Array<any>;
  @Prop({ type: Array, required: true }) readonly dataToDownload!: Array<any>;
  @Prop({ type: Number, required: false, default: 0 }) readonly totalSettlement!: number;

  /**
   * data:
   * searchFilter: String
   * operators: Array of available database operators
   * operator: String of selected operators
   * searchValues: Array of values generated from searchFilter
   * searchValue: String value of searchValues
   */

  searchFilter = '';
  operators = [
    { value: 'eq', text: '=' },
    { value: 'like', text: 'like' },
    { value: 'lte', text: '<=' },
    { value: 'gte', text: '>=' },
  ];
  operator = '';
  searchValues: IDropDownData[] | undefined = [];
  searchValue = '';
  shortcuts = this.generateShortcut();
  showConfirmDialog = false;
  btnDisabled = true;

  /**
   * watcher
   * searchFilterBy: put searchFilterBy value inside store
   * operator: put operator value inside store
   */

  @Watch('searchFilter')
  onSearchFilterChange() {
    if (this.searchFilter !== '') {
      this.searchFilterAction(this.searchFilter);
    }
  }
  @Watch('operator')
  onOperatorChange() {
    if (this.operator !== '') {
      this.$store.dispatch('setTableFilter', { operator: this.operator });
    }
  }
  @Watch('searchValue')
  onSearchValueChange() {
    if (this.searchValue !== '') {
      this.$store.dispatch('setTableFilter', { searchValue: this.searchValue });
      this.btnDisabled = false;
    }
  }
  @Watch('dates')
  onDatesChange() {
    if (this.dates) {
      this.$store.dispatch('setTableFilter', { dates: this.dates });
      this.btnDisabled = false;
    }
  }

  async searchFilterAction(searchFilter: string) {
    this.$store.dispatch('setTableFilter', {
      searchFilter,
    });
    this.searchValues = await this.getTransactionFilter(searchFilter);
  }
  clearFilter() {
    this.searchValues = [];
    this.searchValue = '';
    this.searchFilter = '';
    this.dates = null;
    this.btnDisabled = true;
    this.$store.dispatch('clearTableFilter');
    this.applyFilter();
  }
  applyFilter() {
    this.$emit('applyFilter');
  }
  csvExport(title: string, data: any) {
    const options = {
      filename: title,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: title,
      useBom: true,
      useKeysAsHeaders: true,
    };

    if (data.length) {
      // const csvExporter = new ExportToCsv(options);
      // csvExporter.generateCsv(data);
    }
  }

  download() {
    this.showConfirmDialog = false;
    const title = `Mika_Transaction_Report_${this.$moment().format('YYYY-MM-DD_HH:mm:ss')}`;
    this.csvExport(title, this.dataToDownload);
  }
}
</script>
