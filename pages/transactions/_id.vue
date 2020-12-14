<template>
  <div>
    <div class="page-title">
      <h3 class="title">Transactions Detail</h3>
      <v-breadcrumbs>
        <v-breadcrumbs-item exact nuxt to="/">Dashboard</v-breadcrumbs-item>
        <span class="mx-2">
          <v-icon>keyboard_arrow_right</v-icon>
        </span>
        <v-breadcrumbs-item exact nuxt to="/transactions">Transactions</v-breadcrumbs-item>
        <span class="mx-2">
          <v-icon>keyboard_arrow_right</v-icon>
        </span>
        <v-breadcrumbs-item active>Detail</v-breadcrumbs-item>
      </v-breadcrumbs>
    </div>
    <v-card flat>
      <v-card-text>
        <v-container fluid grid-list-md>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <th>ID :</th>
                  <td>{{ transactionData.id }}</td>
                  <th>ID Alias :</th>
                  <td>{{ transactionData.idAlias }}</td>
                </tr>
                <tr>
                  <th>Acquirer :</th>
                  <td>
                    {{ transactionData.acquirer ? transactionData.acquirer.name : '' }}
                  </td>
                  <th>Agent :</th>
                  <td>
                    {{ transactionData.agent ? transactionData.agent.name : '' }}
                  </td>
                </tr>
                <tr>
                  <th>Share Acquirer :</th>
                  <td>{{ transactionData.shareAcquirer }}</td>
                  <th>Share Merchant :</th>
                  <td>{{ transactionData.shareMerchant }}</td>
                </tr>
                <tr>
                  <th>Share Partner :</th>
                  <td>{{ transactionData.sharePartner }}</td>
                  <th>Share Merchant with Partner :</th>
                  <td>{{ transactionData.shareMerchantWithPartner }}</td>
                </tr>
                <tr>
                  <th>Amount :</th>
                  <td>
                    {{
                      transactionData.amount
                        | currency('', 2, {
                          thousandsSeparator: '.',
                          decimalSeparator: ',',
                        })
                    }}
                  </td>
                  <th>Status :</th>
                  <td>
                    <v-chip :color="getStatusColor(transactionData.status)">
                      <span>{{ transactionData.status }}</span>
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <th>Settlement Status</th>
                  <td>{{ transactionData.settlementStatus }}</td>
                  <th>Date :</th>
                  <td>
                    {{ $moment(transactionData.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator';
import transaction from '~/mixins/transaction';
import { snakeCase } from 'change-case';
import { Context } from '@nuxt/types';
import { getUserUrl } from '~/lib/apiUrls';
@Component
export default class TransactionDetailPage extends mixins(transaction) {
  breadcrumbs = [
    {
      text: 'Dashboard',
      disabled: false,
      href: '/',
    },
    {
      text: 'Transactions',
      disabled: false,
      href: '/transactions',
    },
    {
      text: 'Detail',
      disabled: true,
      href: 'breadcrumbs_link_2',
    },
  ];
  get transactionData() {
    return this.$store.state.currentEdit;
  }
  async fetch({ store, $axios, params }: Context): Promise<void> {
    try {
      const resp = await $axios.$get(`${getUserUrl()}/transactions/${params.id}`);
      if (resp) store.commit('SET_CURRENT_EDIT', resp.data);
    } catch (e) {
      console.log(e);
    }
  }

  formatNumber(num: number): string {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
</script>
