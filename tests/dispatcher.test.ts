import { Dispatcher } from '../src/dispatcher';
import { describe, it } from 'mocha';
import { expect } from 'chai';

export interface IUser {
  email: string;
  username: string;
}

export enum EActions {
  USER_CHANGE_NAME = "user/userId123/change_name"
}

const NEW_USER_NAME = "John Doe";

describe('dispatcher', function() {
  it('generates the correct prevState', function() {
    const dispatcher = new Dispatcher<IUser>();
    let numberOfRuns = 0;

    dispatcher.when(EActions.USER_CHANGE_NAME, (prevState: IUser, nextState: IUser) => {
      if (numberOfRuns == 0) {
        expect(prevState).equals(undefined);
      } else {
        expect(prevState.username).equals(NEW_USER_NAME);
      }
      numberOfRuns += 1;
      return {...nextState, username: NEW_USER_NAME};
    });

    dispatcher.emit(EActions.USER_CHANGE_NAME, ({ username: NEW_USER_NAME }));
    dispatcher.emit(EActions.USER_CHANGE_NAME, ({ username: NEW_USER_NAME }));
  });

  it('reduces correctly', function() {
    const dispatcher = new Dispatcher<IUser>();

    dispatcher.when(EActions.USER_CHANGE_NAME, (prevState: IUser, nextState: IUser) => {
      return {...nextState, username: NEW_USER_NAME};
    });
    
    expect(EActions.USER_CHANGE_NAME in dispatcher.nextState).equals(false);

    dispatcher.emit(EActions.USER_CHANGE_NAME, ({ username: NEW_USER_NAME }));
    
    expect(EActions.USER_CHANGE_NAME in dispatcher.nextState).equals(true);
    expect('username' in dispatcher.nextState[EActions.USER_CHANGE_NAME]).equals(true);
  });
});
