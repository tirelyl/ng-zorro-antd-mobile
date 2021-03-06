import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  HostBinding,
  Renderer2,
  ElementRef
} from '@angular/core';
import { StepStatusEnum, StepDirectionEnum } from './step/step.component';
import { StepComponent } from './step/step.component';

@Component({
  selector: 'Steps,nzm-steps',
  templateUrl: './steps.component.html'
})
export class StepsComponent implements OnInit, AfterContentInit {
  prefixCls: string = 'am-steps';

  private _current: number = 0;
  private _size: string;
  private _status: StepStatusEnum = StepStatusEnum.PROCESS;
  private _direction: StepDirectionEnum = StepDirectionEnum.VERTICAL;
  private _stepsCls: object;

  @ContentChildren(StepComponent)
  stepItems: QueryList<StepComponent>;

  @Input()
  set current(value) {
    if (value >= 0) {
      this._current = value;
    }
  }
  @Input()
  set size(value) {
    this._size = value;
    this.setCls();
  }
  @Input()
  set status(value: StepStatusEnum) {
    this._status = value;
    if (this.stepItems) {
      this.setStepStyle();
    }
  }
  @Input()
  set direction(value: StepDirectionEnum) {
    this._direction = value;
    this.setCls();
  }

  @HostBinding('class.am-steps')
  clsSteps: boolean = true;
  @HostBinding('class.am-steps-small')
  clsStepsSmall: boolean;
  @HostBinding('class.am-steps-label-vertical')
  clsStepsLabelVtl: boolean;
  @HostBinding('class.am-steps-vertical')
  clsStepsVtl: boolean;
  @HostBinding('class.am-steps-horizontal')
  clsStepsHztl: boolean;

  constructor(private _elf: ElementRef, private _render: Renderer2) {}

  setStepStyle() {
    const itemCount = this.stepItems.length;
    const itemArr = this.stepItems['_results'];
    for (let index = 0; index < itemCount; index++) {
      const step = itemArr[index];
      step.stepNumber = index + 1;
      if (index < itemCount - 1 && itemArr[index + 1].status === StepStatusEnum.ERROR) {
        step.stepItemCls = step.stepItemCls
          ? Object.assign(step.stepItemCls, { 'error-tail': true })
          : { 'error-tail': true };
      }
      let icon = step.icon;
      if (!step.status) {
        if (index === this._current) {
          step.status = this._status;
        } else if (index < this._current) {
          step.status = StepStatusEnum.FINISH;
        } else {
          step.status = StepStatusEnum.WAIT;
        }
      } else if (step.status && !icon) {
        switch (step.status) {
          case StepStatusEnum.FINISH:
            icon = 'check-circle-o';
            break;
          case StepStatusEnum.ERROR:
            icon = 'cross-circle-o';
            break;
        }
      }
      if (!icon && step.status !== StepStatusEnum.PROCESS) {
        if (index < this._current) {
          icon = 'check-circle-o';
        } else if (index > this._current) {
          icon = 'ellipsis';
          step.stepItemCls = step.stepItemCls
            ? Object.assign(step.stepItemCls, { 'ellipsis-item': true })
            : { 'ellipsis-item': true };
        }
        if (
          (this._status === StepStatusEnum.ERROR && index === this._current) ||
          step.status === StepStatusEnum.ERROR
        ) {
          icon = 'cross-circle-o';
        }
      }
      step.icon = icon;
      step.iconSize = this._size === 'small' ? (this._status === StepStatusEnum.WAIT ? 'xxs' : 'xs') : 'md';
      step.setClass();
    }
  }

  setCls() {
    if (this._direction === StepDirectionEnum.HORIZONTAL) {
      this.clsStepsLabelVtl = true;
      this.clsStepsHztl = true;
      this.clsStepsVtl = false;
    } else if (this._direction === StepDirectionEnum.VERTICAL) {
      this.clsStepsVtl = true;
      this.clsStepsHztl = false;
    }
    if (this._size === 'small') {
      this.clsStepsSmall = true;
    } else {
      this.clsStepsSmall = false;
    }
  }

  ngOnInit() {
    this.setCls();
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.setStepStyle();
    }, 0);
    this.stepItems.changes.subscribe(change => {
      setTimeout(() => {
        this.setStepStyle();
      }, 0);
    });
  }

}
