import { snakeCase } from 'change-case';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { MIKA_USER_TYPE } from '~/lib/constants';
import { IAuth, ILoginData, ISnackbar, ITableFilter, IUser } from '~/lib/interfaces';

const initialFilterTable = {
  searchFilter: '',
  operator: 'eq',
  searchValue: null,
  dates: null,
};

export const state = () => ({
  snackbar: {
    show: false,
    text: '',
    color: 'success',
  } as ISnackbar,
  auth: {
    user: null,
  } as IAuth,
  tableFilter: initialFilterTable as ITableFilter,
  currentEdit: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {
  SHOW_SNACKBAR: (state, value: ISnackbar) => (state.snackbar = { ...value }),
  SET_AUTH: (state, value: IAuth) => (state.auth = value),
  SET_TABLE_FILTER: (state, value: ITableFilter) => (state.tableFilter = value),
  SET_CURRENT_EDIT: (state, value: any) => (state.currentEdit = value),
};

export const actions: ActionTree<RootState, RootState> = {
  setTableFilter({ commit, state }, value) {
    const newTableFilter = { ...state.tableFilter, ...value };
    commit('SET_TABLE_FILTER', newTableFilter);
  },
  clearTableFilter({ commit }) {
    commit('SET_TABLE_FILTER', initialFilterTable);
  },
  async setAuth({ commit }, respData: ILoginData) {
    window.localStorage.setItem(MIKA_USER_TYPE, respData.userType);
    const resp = await this.$axios.$get(`/${snakeCase(respData.userType)}`);
    const user: IUser = resp.data;
    const auth: IAuth = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        merchantId: user.merchantId,
      },
    };
    commit('SET_AUTH', auth);
  },

  logout() {
    window.location.replace('/login');
  },
};
