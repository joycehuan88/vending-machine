import { Injectable } from '@angular/core';
import { Machine, State, StateNode, StateValue } from 'xstate';
export enum Status {
  READY = 'ready',
  PURCHASE = 'purchase',
  SUCCESSTOBUY = 'success-to-buy',
  FAILTOBUY = 'fail-to-buy',
  SUPPLY = 'supply',
  SUCCESSTOSUPPLY = 'success-to-supply',
}

export enum IActions {
  BUY = 'buy',
  SUPPLY = 'supply',
  CONFIRM = 'confirm',
  CANCEL = 'cancel',
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  buyNum = 0;
  supplyNum = 0;
  money = 0;
  message = '';
  vendingMachine = Machine(
    {
      id: 'vending-machine',
      initial: Status.READY,
      context: {
        goods: {
          change: 0,
          price: 1.2,
          stock: 1,
        },
      },
      states: {
        [Status.READY]: {
          on: {
            [IActions.BUY]: Status.PURCHASE,
            [IActions.SUPPLY]: Status.SUPPLY,
          },
        },
        [Status.PURCHASE]: {
          on: {
            [IActions.CONFIRM]: [
              { target: Status.SUCCESSTOBUY, cond: () => this.buyValid() },
              { target: Status.FAILTOBUY },
            ],
            [IActions.CANCEL]: Status.READY,
          },
        },
        [Status.SUPPLY]: {
          on: {
            [IActions.CONFIRM]: [
              {
                target: Status.SUCCESSTOSUPPLY,
                cond: () => this.supplyValid(),
              },
            ],
            [IActions.CANCEL]: Status.READY,
          },
        },
        [Status.SUCCESSTOBUY]: {
          on: {
            '': {
              target: Status.READY,
            },
          },
        },
        [Status.FAILTOBUY]: {
          on: {
            '': Status.PURCHASE,
          },
        },
        [Status.SUCCESSTOSUPPLY]: {
          on: {
            '': Status.READY,
          },
        },
      },
    }
  );

  currentState = this.vendingMachine.initialState;

  constructor() {}

  handleBuySuccessfully(): void {
    this.vendingMachine.context.goods.stock -= this.buyNum;
    this.vendingMachine.context.goods.change -=
      this.buyNum * this.vendingMachine.context.goods.price;
    this.vendingMachine.context.goods.change = Number(this.vendingMachine.context.goods.change.toFixed(2));
    this.message = `Return ${this.buyNum} can with correct change.`;
  }

  handleBuyFailly(): void {}

  handleInputMoney(money: number): void {
    this.money = money;
    this.vendingMachine.context.goods.change = money;
  }

  handleInputBuyNum(num: number): void {
    this.buyNum = num;
  }

  handleInputSupplyNum(num: number): void {
    this.supplyNum = num;
  }

  handleAction(act): void {
    this.currentState = this.vendingMachine.transition(this.currentState, act);
  }

  getCurrentState(): StateValue {
    return this.currentState.value;
  }

  supplyValid(): boolean {
    this.vendingMachine.context.goods.stock += this.supplyNum;
    this.message = `Resupplied with ${this.supplyNum} cans`;
    return true;
  }

  buyValid(): boolean {
    if (this.buyNum <= 0) {
      return false;
    }
    if (this.money < this.vendingMachine.context.goods.price * this.buyNum) {
      this.message = 'Insufficient money';
      return false;
    }
    if (this.buyNum > this.vendingMachine.context.goods.stock) {
      this.message = 'Out of stock';
      return false;
    }
    this.handleBuySuccessfully();
    return true;
  }
}
