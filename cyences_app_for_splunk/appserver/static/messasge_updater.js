define([
    'jquery',
    'splunkjs/mvc/simplexml/ready!'
], function ($) {

    class MessageUpdater {
        constructor(jqueryHtmlElementSelector) {
            this.jqueryHtmlElement = jqueryHtmlElementSelector;
        }

        setSuccessMessage(msg) {
            $(this.jqueryHtmlElement).addClass('success_msg');
            $(this.jqueryHtmlElement).removeClass('error_msg');
            $(this.jqueryHtmlElement).text(msg);
        }

        setFailureMessage(msg) {
            $(this.jqueryHtmlElement).addClass('success_msg');
            $(this.jqueryHtmlElement).removeClass('error_msg');
            $(this.jqueryHtmlElement).text(msg);
        }

        setMessage(msg) {
            $(this.jqueryHtmlElement).removeClass('success_msg');
            $(this.jqueryHtmlElement).removeClass('error_msg');
            $(this.jqueryHtmlElement).text(msg);
        }
    }

    return MessageUpdater;
});
