/*
 * Copyright (C) 2017/2020 e-voyageurs technologies
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit, EventEmitter, Input, Output} from "@angular/core";
import {NbCalendarRange, NbDateService} from '@nebular/theme';

@Component({
  selector: 'date-range-calendar',
  templateUrl: './date-range-calendar.component.html',
  styleUrls: ['./date-range-calendar.component.css']
})
export class DateRangeCalendarComponent implements OnInit {

  range: NbCalendarRange<Date>;
  displayCalendar = false;

  @Input()
  rangeInDays = 7;

  @Input()
  disabled = false;

  @Output()
  datesChanged: EventEmitter<[Date, Date]> = new EventEmitter();

  constructor(protected dateService: NbDateService<Date>) {
  }

  ngOnInit(): void {
    this.setRangeInDays(this.rangeInDays);
  }

  toggle() {
    this.displayCalendar = this.disabled ? false : !this.displayCalendar;
  }

  getStatus(nbDays): string {
    return "basic";
  }

  setRangeInDays(days: number) {
    this.rangeInDays = days;
    this.resetRange(days);
    this.update();
  }

  resetRange(days: number) {
    if (days == 0) {
      this.range = {
        start: this.dateService.today(),
        end: this.dateService.today()
      };
    } else if (days == 1) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      this.range = {
        start: yesterday,
        end: yesterday
      };
    } else {
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)
      this.range = {
        start: fromDate,
        end: this.dateService.today()
      };
    }
    this.normalizeDateTimes();
  }

  normalizeDateTimes() {
    let start = null;
    let end = null;
    if (this.range.start != null) {
      start = new Date(JSON.parse(JSON.stringify(this.range.start))); // clone
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
    }
    if (this.range.end != null) {
      end = new Date(JSON.parse(JSON.stringify(this.range.end))); // clone
      end.setHours(23);
      end.setMinutes(59);
      end.setSeconds(59);
    }
    this.range = {
      start: start,
      end: end
    };
  }

  update() {
    this.displayCalendar = false;
    if (this.range.start != null) {
      this.normalizeDateTimes();
      console.debug('Dates changed: start=' + this.range.start + ', end=' + this.range.end);
      this.datesChanged.emit([this.range.start, this.range.end]);
    }
  }
}
