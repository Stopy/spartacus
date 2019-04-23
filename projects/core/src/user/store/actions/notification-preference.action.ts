import { Action } from '@ngrx/store';
import { BasicNotificationPreferenceList } from '../../model/user.model';

export const LOAD_NOTIFICATION_PREFERENCES =
  '[User] Load Notification Preferences';
export const LOAD_NOTIFICATION_PREFERENCES_FAIL =
  '[User] Load Notification Preferences Fail';
export const LOAD_NOTIFICATION_PREFERENCES_SUCCESS =
  '[User] Load Notification Preferences Success';

export const UPDATE_NOTIFICATION_PREFERENCES =
  '[User] Update Notification Preferences';
export const UPDATE_NOTIFICATION_PREFERENCES_FAIL =
  '[User] Update Notification Preferences Fail';
export const UPDATE_NOTIFICATION_PREFERENCES_SUCCESS =
  '[User] Update Notification Preferences Success';

export class LoadNotificationPreferences implements Action {
  readonly type = LOAD_NOTIFICATION_PREFERENCES;
  constructor(public payload: string) {}
}

export class LoadNotificationPreferencesFail implements Action {
  readonly type = LOAD_NOTIFICATION_PREFERENCES_FAIL;
  constructor(public payload: any) {}
}

export class LoadNotificationPreferencesSuccess implements Action {
  readonly type = LOAD_NOTIFICATION_PREFERENCES_SUCCESS;
  constructor(public payload: BasicNotificationPreferenceList) {}
}

export class UpdateNotificationPreferences implements Action {
  readonly type = UPDATE_NOTIFICATION_PREFERENCES;
  constructor(
    public payload: {
      userId: string;
      basicNotificationPreferenceList: BasicNotificationPreferenceList;
    }
  ) {}
}
export class UpdateNotificationPreferencesFail implements Action {
  readonly type = UPDATE_NOTIFICATION_PREFERENCES_FAIL;
  constructor(public payload: any) {}
}
export class UpdateNotificationPreferencesSuccess implements Action {
  readonly type = UPDATE_NOTIFICATION_PREFERENCES_SUCCESS;
  constructor(public payload: BasicNotificationPreferenceList) {}
}
export type NotificationPreferenceAction =
  | LoadNotificationPreferences
  | LoadNotificationPreferencesFail
  | LoadNotificationPreferencesSuccess
  | UpdateNotificationPreferences
  | UpdateNotificationPreferencesFail
  | UpdateNotificationPreferencesSuccess;
