import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dual-panel-calender',
  templateUrl: './dual-panel-calender.component.html',
  styleUrls: ['./dual-panel-calender.component.css'],
  animations: [
    trigger('calendarAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.Default 
})
export class DualPanelCalenderComponent {
  mode = 'basic';  
  startDate: string | null = null;
  endDate: string | null = null;
  excludeWeekends = false;
  customExcludedDays: string[] = [];
  maxDaysBetween: number | null = null;

  currentMonthStart: Date = new Date(); 
  currentMonthEnd: Date = new Date(); 
  daysOfWeek = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDayswithoutWeekend : string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  DateRange : number | null = null;

  transitionState = 'active';

  constructor(private cdr: ChangeDetectorRef) {}

  toggleMode() {
    this.mode = this.mode === 'basic' ? 'advanced' : 'basic';
  }

  getFormattedDate(year: number, month: number, day: number): string {
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  prevMonth(type: 'start' | 'end') {
    if (type === 'start') {
      const newDate = new Date(this.currentMonthStart);
      newDate.setMonth(newDate.getMonth() - 1);
      this.currentMonthStart = newDate;
    } else {
      const newDate = new Date(this.currentMonthEnd);
      newDate.setMonth(newDate.getMonth() - 1);
      this.currentMonthEnd = newDate;
    }
    this.cdr.detectChanges(); 
  }

  nextMonth(type: 'start' | 'end') {
    if (type === 'start') {
      const newDate = new Date(this.currentMonthStart);
      newDate.setMonth(newDate.getMonth() + 1);
      this.currentMonthStart = newDate;
    } else {
      const newDate = new Date(this.currentMonthEnd);
      newDate.setMonth(newDate.getMonth() + 1);
      this.currentMonthEnd = newDate;
    }
    this.cdr.detectChanges(); 
  }




getDaysInMonth(month: Date): number[] {
  const year = month.getFullYear();
  const startOfMonth = new Date(year, month.getMonth(), 1);
  const endOfMonth = new Date(year, month.getMonth() + 1, 0);

  const days: number[] = [];
  // 0 = Sunday, 6 = Saturday
  const firstDayIndex = startOfMonth.getDay(); 

  for (let i = 0; i < firstDayIndex; i++) {
      days.push(0);
  }

  for (let day = 1; day <= endOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month.getMonth(), day);
      const currentDayIndex = currentDate.getDay(); 
      if (this.excludeWeekends && (currentDayIndex === 0 || currentDayIndex === 6)) {
          // days.push(0);
      } else {
          days.push(day);
      }
  }

  while (days.length % 7 !== 0) {
      days.push(0);
  }

  return days;
}

  isInRange(day: number, month: Date, type: 'start' | 'end'): boolean {
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0];
    const startDateStr = this.startDate ? new Date(this.startDate).toISOString().split('T')[0] : null;
    const endDateStr = this.endDate ? new Date(this.endDate).toISOString().split('T')[0] : null;

    if (!startDateStr || !endDateStr) {
        return false;
    }
    return selectedDate >= startDateStr && selectedDate <= endDateStr;
}

  selectDate(calendar: 'start' | 'end', day: number) {
    const selectedDate = new Date(this.currentMonthStart.getFullYear(), this.currentMonthStart.getMonth(), day);
    if (calendar === 'start') {
      if (this.endDate) {
        const endDateObj = new Date(this.endDate);
        const diff = (endDateObj.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (this.maxDaysBetween && diff > this.maxDaysBetween) {
          alert(`End date cannot be more than ${this.maxDaysBetween} days after the start date.`);
          return;
        }
      }
      this.startDate = selectedDate.toISOString().split('T')[0]; // Set to ISO format
    } else {
      if (this.startDate) {
        const startDateObj = new Date(this.startDate);
        const diff = (selectedDate.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24);
        if (this.maxDaysBetween && diff > this.maxDaysBetween) {
          alert(`End date cannot be more than ${this.maxDaysBetween} days after the start date.`);
          return;
        }
      }
      this.endDate = selectedDate.toISOString().split('T')[0]; // Set to ISO format
    }
  }

  // isDayExcluded(day: number, currentMonth: Date): boolean {
  //   const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  //   const dayOfWeek = currentDate.getDay();

  //   if (this.excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
  //     return true;
  //   }

  //   return this.customExcludedDays.includes(dayOfWeek.toString());
  // }


  onDateChange(event: any, type: 'start' | 'end') {
    const selectedDate = event.target.value;
    if (type === 'start') {
      this.startDate = selectedDate;
    } else {
      this.endDate = selectedDate;
    }
    

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const differenceInMs = end.getTime() - start.getTime();
      const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

      if (this.maxDaysBetween !== null && this.maxDaysBetween !== undefined && differenceInDays > this.maxDaysBetween) {
        alert('Date range exceeds the maximum allowed range!');
      }
    }
  }

  isEndDateInvalid(): boolean {
    if (this.startDate && this.endDate) {
      return new Date(this.endDate) < new Date(this.startDate);
    }
    return false;
  }

  dateRange() : number | null {
    console.log("Callinf this function")
    if (this.startDate && this.endDate) {
    let start = new Date(this.startDate);
    let end = new Date(this.endDate)
    let timeDiff = Math.abs(start.getTime() - end.getTime());
    this.DateRange = Math.round(timeDiff/(1000 * 3600 * 24)) 
     return this.DateRange;
    }
    return null;
  }

}
