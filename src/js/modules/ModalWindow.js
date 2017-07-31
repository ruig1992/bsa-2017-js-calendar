/*
 * ModalWindow class module
 */
"use strict";

class ModalWindow {

    constructor(modalSelector) {
        this.modalWindow = $(modalSelector || '#events-calendar-modal')
            .modal({
                transition: 'vertical flip',
                onShow: function() {
                    $(this).find('.participant').popup({
                        inline: true,
                    });
                },
            });
    }

    show() {
        return this.modalWindow.modal('show');
    }

    hide() {
        return this.modalWindow.modal('hide');
    }

    toggle() {
        return this.modalWindow.modal('toggle');
    }

    render(event) {
        const BUTTON_LABEL = 'Ok, I got it! Thanks!';

        this.modalWindow.html(
            '<div class="ui header">' + event.title +
            '<div class="sub header">' + moment(event.date).format('D MMMM YYYY') +
            ' &mdash; #' + event.id + '</div></div><div class="content">' +

            (event.description ?
                '<p><strong>' + event.description + '</strong></p>' : '') +

            (event.todo_list ? (event.todo_list.reduce(
                (html, todo) => html += '<div class="item">' + todo + '</div>',
                '<div class="ui bulleted list">') +
            '</div>') : '') +

            (event.participants ? ('<div class="ui divider"></div>' +

              event.participants.reduce(
                (html, participant) => html += '<div class="item"><a href="' +
                    (participant.profile ? participant.profile : '#') +
                    '" target="_blank" class="participant" data-content="' +
                    participant.name +
                    '" data-position="top center" data-variation="tiny inverted">' +
                    (participant.avatar ? '<img class="ui avatar image" src="' +
                        participant.avatar + '">' :
                        '<i class="user circle big grey fitted icon"></i>') +
                    '</a></div>', '<div class="ui horizontal list">') +
              '</div>') : '') +

            '</div><div class="actions"><div class="ui basic cancel fluid button"><strong>' +
                BUTTON_LABEL + '</strong></div></div>'
        );

        return this;
    }

}

export default ModalWindow
