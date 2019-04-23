import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { OccUserService } from '../../occ/user.service';
import * as fromAction from '../actions/notification-preference.action';
import {
  BasicNotificationPreferenceList,
  NotificationPreferenceList,
} from '../../model/user.model';
@Injectable()
export class NotificationPreferenceEffects {
  @Effect()
  loadNotificationPreferences$: Observable<
    fromAction.NotificationPreferenceAction
  > = this.actions$.pipe(
    ofType(fromAction.LOAD_NOTIFICATION_PREFERENCES),
    map((action: fromAction.LoadNotificationPreferences) => action.payload),
    switchMap(payload => {
      return this.occUserService.getNotificationPreference(payload).pipe(
        map(
          (preferences: BasicNotificationPreferenceList) =>
            new fromAction.LoadNotificationPreferencesSuccess(preferences)
        ),
        catchError(error =>
          of(new fromAction.LoadNotificationPreferencesFail(error))
        )
      );
    })
  );

  @Effect()
  updateNotificationPreferences$: Observable<
    fromAction.NotificationPreferenceAction
  > = this.actions$.pipe(
    ofType(fromAction.UPDATE_NOTIFICATION_PREFERENCES),
    map((action: fromAction.UpdateNotificationPreferences) => action.payload),
    switchMap(payload => {
      const notificationPreferenceList: NotificationPreferenceList = {
        preferences: [],
      };
      payload.basicNotificationPreferenceList.preferences.forEach(p => {
        notificationPreferenceList.preferences.push({
          channel: p.channel,
          enabled: p.enabled,
        });
      });

      return this.occUserService
        .updateNotificationPreference(
          payload.userId,
          notificationPreferenceList
        )
        .pipe(
          map(() => {
            return new fromAction.UpdateNotificationPreferencesSuccess(
              payload.basicNotificationPreferenceList
            );
          }),
          catchError(error =>
            of(new fromAction.UpdateNotificationPreferencesFail(error))
          )
        );
    })
  );

  constructor(
    private actions$: Actions,
    private occUserService: OccUserService
  ) {}
}
