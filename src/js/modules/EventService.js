/*
 * EventService class module
 */
"use strict";

class EventService {

    constructor(events) {
        this.events = events;
        this.eventsLabelsColors = [
            'red', 'orange', 'yellow',
            'olive', 'green', 'teal',
            'blue', 'violet', 'purple',
            'pink', 'brown', 'grey',
            'black',
        ];
    }

    findById(id) {
        return this.events.find(event => event.id === id);
    }

    renderEvents(date) {
        return this.events.filter((event) => event.date === date)
            .reduce((html, event) => {
                var randomColor = _.sample(this.eventsLabelsColors);

                return html += `
<div class="date-event ui mini empty circular label ${randomColor}"
    data-event-id="${event.id}" data-content="${event.title}"
    data-position="top center" data-variation="tiny inverted"></div>`;

            }, '');
    }

}

export default EventService
