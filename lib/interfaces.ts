export interface ISnackbar {
  show: boolean;
  text: string;
  color: string;
}

export interface IAuth {
  user: IUser | null;
}

export interface IDropDownData {
  value: any;
  text: string;
}

export interface IApiDbData {
  id: number;
  name: string;
}

export interface ITableOptions {
  page: number;
  itemsPerPage: number;
  perPage: number;
  sortBy: string[];
  sortDesc: boolean[];
  groupBy: string[];
  groupDesc: boolean[];
  multiSort: boolean;
  mustSort: boolean;
  getCount: number;
  orderBy: string;
  order: string;
}

export interface ITableHeaders {
  text: string;
  value: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  divider?: boolean;
  class?: string | string[];
  width?: string | number;
  filter?: (value: any, search: string, item: any) => boolean;
  sort?: (a: any, b: any) => number;
}

export interface IDataTableHeader {
  text: string;
  value: string;
  sortable?: boolean;
  filterAs?: string;
}

export interface ITableFilter {
  searchFilter: string;
  operator: string;
  searchValue: any;
  dates: Array<Date> | null;
}

export interface IStatisticTransaction {
  createdAt: string;
  totalAmount: string;
  totalAmountNoRefund: string;
  totalNettAmount: string;
  transactionCount: string;
}

export interface IChartDataSet {
  label: string;
  backgroundColor?: string;
  data: Array<string>;
}

export interface IChartData {
  labels: Array<string>;
  datasets: IChartDataSet[];
}

export interface IMikaResponse {
  version: string;
  status: string;
  message: string;
  isError: boolean;
}

export interface ILoginData {
  userId: number;
  username: string;
  userType: string;
  userExpiry: number | null;
  merchantStaffId: number;
  merchantId: number;
  sessionToken: string;
  authExpirySecond: number;
  userDek: string;
  sessionUserDek: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  merchantId?: number;
}

export interface IUserResponse extends IMikaResponse {
  data: IUser;
}
