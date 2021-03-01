// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { StateService, IActions } from './app/state.service';

describe('stateService', function () {
  let stateService: StateService = new StateService();
  it('test Actions', function () {
    // action 1
    stateService.handleAction(IActions.BUY);
    stateService.buyNum = 1;
    stateService.money = 2;

    stateService.handleAction(IActions.CONFIRM);
    expect(stateService.message).toBe(`Return 1 can with correct change.`);

    // aciton2
    stateService.handleAction(IActions.BUY);
    stateService.buyNum = 1;
    stateService.money = 1;
    stateService.handleAction(IActions.CONFIRM);
    expect(stateService.message).toBe(`Insufficient money`);

    // aciton3
    stateService.handleAction(IActions.BUY);
    stateService.buyNum = 1;
    stateService.money = 1.5;
    stateService.handleAction(IActions.CONFIRM);
    expect(stateService.message).toBe(`Out of stock`);

    // aciton4
    stateService.handleAction(IActions.CANCEL);
    stateService.handleAction(IActions.SUPPLY);
    stateService.supplyNum = 10;
    stateService.handleAction(IActions.CONFIRM);
    expect(stateService.message).toBe(`Resupplied with 10 cans`);

  });


});
