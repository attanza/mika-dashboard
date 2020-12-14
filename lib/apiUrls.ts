import { snakeCase } from 'change-case';
import { MIKA_USER_TYPE } from './constants';

export enum EUserType {
  merchantStaff = 'merchantStaff',
  acquirerStaff = 'acquirerStaff',
}
export const getUserUrl = (): string => {
  if (process.client) {
    const userType = window.localStorage.getItem(MIKA_USER_TYPE);
    if (userType) {
      return '/' + snakeCase(userType);
    }
  }
  return '/merchantStaff';
};

export const getUserType = (): EUserType => {
  const userType = window.localStorage.getItem(MIKA_USER_TYPE) as EUserType;
  if (userType) {
    return userType;
  }
  return EUserType.merchantStaff;
};
