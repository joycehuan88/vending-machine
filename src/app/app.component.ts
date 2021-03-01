import { Component } from '@angular/core';
import { StateService } from './state.service';
export enum Status {
  READY = 'ready',
  PURCHASE = 'purchase',
  SUCCESSTOBUY = 'success-to-buy',
  FAILTOBUY = 'fail-to-buy',
  SUPPLY = 'supply',
  SUCCESSTOSUPPLY = 'success-to-supply',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'vending-machine';
  input = {
    buyNum: 0,
    supplyNum: 0,
    money: 0,
  };
  goods = {
    price: 1,
    stock: 1,
    change: 0,
  };
  status: Status = Status.READY;

  constructor(private stateService: StateService) {}

  getMessage(): string {
    return this.stateService.message;
  }

  handleInputMoney(): void {
    const money = Number(this.input.money);
    this.stateService.handleInputMoney(money);
    this.setState();
  }

  handleInputBuyNum(): void {
    const buyNum = Number(this.input.buyNum);
    this.stateService.handleInputBuyNum(buyNum);
    this.setState();
  }

  handleInputSupplyNum(): void {
    const supplyNum = Number(this.input.supplyNum);
    this.stateService.handleInputSupplyNum(supplyNum);
    this.setState();
  }

  handleAct(action): void {
    this.stateService.handleAction(action);
    this.setState();
  }

  setState(): void {
    this.status = this.stateService.getCurrentState() as Status;
    this.goods.price = this.stateService.vendingMachine.context.goods.price;
    this.goods.stock = this.stateService.vendingMachine.context.goods.stock;
    this.goods.change = this.stateService.vendingMachine.context.goods.change;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {
    this.setState();
  }
}
