/**
 * Get searchValue retreived from API back end an populate them inside tableFilter component
 */
import { Component, Mixins } from 'vue-property-decorator';
import { IApiDbData, IDropDownData } from '~/lib/interfaces';
import catchError from './catchError';

@Component
export default class TransactionFilterMixin extends Mixins(catchError) {
  async getTransactionFilter(val: string) {
    let data: IDropDownData[] | undefined = [];
    const url = this.generateUrl(val);
    if (url) {
      data = await this.getData(url, val);
    }
    return data;
  }
  async getData(url: string, val: string): Promise<Array<IDropDownData> | undefined> {
    try {
      const resp = await this.$axios.$get(`${url}?order=asc&order_by=name`).then(res => res.data);
      let data: IDropDownData[] = [];
      if (val === 'status') {
        Object.keys(resp.types.transactionStatuses).map(key => {
          data.push({
            value: key,
            text: resp.types.transactionStatuses[key],
          });
        });
      } else {
        resp.map((r: IApiDbData) => data.push({ value: r.id, text: r.name }));
      }
      return data;
    } catch (e) {
      this.catchError(e);
    }
  }
  generateUrl(val: string): string {
    switch (val) {
      case 'agentId':
        return `${this.userUrl}/agents`;
      case 'acquirerId':
        return `${this.userUrl}/acquirers`;
      case 'agent.outletId':
        return `${this.userUrl}/outlets`;
      case 'status':
        return '/utilities/trx_props';
      default:
        return '';
    }
  }
}
