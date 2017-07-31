/*
 * Calendar class module
 */
"use strict";

class Calendar {

    constructor(eventService, modalWindow, calendarSelector, locale) {
        this.calendar = $(calendarSelector || '#events-calendar');
        this.eventService = eventService;
        this.modalWindow = modalWindow;

        this.locale = locale || 'en';
        moment.locale(locale);

        this.setEventsListeners();

        this.show(moment().year());
    }

    setEventsListeners() {
        var _this = this;

        _this.calendar
            .on('click', '.prev', function() {
                _this.show(--_this.year);
            })
            .on('click', '.next', function() {
                _this.show(++_this.year);
            })
            .on('click', '.date-event', function() {
                var event = _this.eventService.findById($(this).data('event-id'));
                if (event === undefined) {
                    return;
                }

                _this.modalWindow
                    .render(event)
                    .show();
            });
    }

    show(year) {
        var _this = this,
            months = [],
            yearContent = '',
            w = 0,
            r = 0,
            weekDaysShort = _this.getWeekDaysShort(),
            monthsNames = moment.months(),
            monthFirstDay;

        _this.year = year;

        for (let m = 0; m <= 11; m++) {
            monthFirstDay = moment([year, m, 1]);

            months.push(
                '<div class="MMMM">' + monthsNames[m] + '</div>' + weekDaysShort +
                '<div class="MM">' +

                _.range(1, monthFirstDay.daysInMonth() + 1).reduce(function(MM, d) {

                    var date = year + '-' +
                        ('00' + (m + 1)).slice(-2) + '-' +
                        ('00' + d).slice(-2);

                    return MM += '<a href="#" class="' + (
                        year == moment().year() &&
                        m == moment().month() &&
                        d == moment().date() ? 'active ' : ''
                    ) +
                    'D" ' + (d == 1 ? 'data-d="' + monthFirstDay.day() + '"' : '') +
                    ' data-date="' + date + '" draggable="false">' +
                    '<span class="num">' + d + '</span>' +
                    '<div class="date-content">' +
                        _this.eventService.renderEvents(date) + '</div></a>';
                }, '') +
                '</div>'
            );

            w = Math.max(w, Math.ceil(
                (monthFirstDay.day() + monthFirstDay.daysInMonth()) / 7)
            );

            if (m == 3 || m == 7 || m == 11) {
                yearContent += '<div class="M" data-w="' + w + '">' +
                    months.join('</div><div class="M" data-w="' + w + '">') +
                    '</div>';
                r += w;
                w = 0;
                months = [];
            }
        } // end the For loop

        _this.renderHtml(yearContent, r);
        _this.calendar.find('.date-event').popup();
    }

    getWeekDaysShort() {
        return moment.weekdaysShort().reduce(function(days, current) {
            return days += `<div class="ddd" data-ddd="${current}"></div>`;
        }, '');
    }

    renderHtml(yearContent, r) {
        this.calendar.html(
`<nav>
  <a href="#" class="nav prev" draggable="false">
    <svg viewBox="0 0 512 512"><path d="M189.8,349.7c3.1-3.1,3-8,0-11.3L123.4,264H408c4.4,0,8-3.6,8-8c0-4.4-3.6-8-8-8H123.4l66.3-74.4c2.9-3.4,3.2-8.1,0.1-11.2c-3.1-3.1-8.5-3.3-11.4-0.1c0,0-79.2,87-80,88S96,253.1,96,256s1.6,4.9,2.4,5.7s80,88,80,88c1.5,1.5,3.6,2.3,5.7,2.3C186.2,352,188.2,351.2,189.8,349.7z"/></svg>
  </a>
  <div class="title">
    <strong>${this.year}</strong>
  </div>
  <a href="#" class="nav next" draggable="false">
    <svg viewBox="0 0 512 512"><path d="M322.2,349.7c-3.1-3.1-3-8,0-11.3l66.4-74.4H104c-4.4,0-8-3.6-8-8c0-4.4,3.6-8,8-8h284.6l-66.3-74.4c-2.9-3.4-3.2-8.1-0.1-11.2c3.1-3.1,8.5-3.3,11.4-0.1c0,0,79.2,87,80,88s2.4,2.8,2.4,5.7s-1.6,4.9-2.4,5.7s-80,88-80,88c-1.5,1.5-3.6,2.3-5.7,2.3C325.8,352,323.8,351.2,322.2,349.7z"/></svg>
  </a>
</nav>
<div class="YYYY" data-w="${r}">${yearContent}</div>
`);

        return this;
    }

}

export default Calendar
