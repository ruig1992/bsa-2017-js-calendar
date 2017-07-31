/*
 * App Main JS
 */
"use strict";

import EventService from './modules/EventService'
import ModalWindow from './modules/ModalWindow'
import Calendar from './modules/Calendar'

document.addEventListener("DOMContentLoaded", function() {
    fetch('/repository/events.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(events) {
            new Calendar(new EventService(events), new ModalWindow());
        })
        .catch(function(error) {
            console.log(error);
        });
});
