define([
    'jquery',
    'splunkjs/mvc/simplexml/ready!'
], function ($) {

    const htmlContentToAdd = `<span class="load"><span class="spin"></span><span class="loading"></span></span>`;

    class Loader {
        constructor(jqueryHtmlElementSelector) {
          this.jqueryHtmlElement = jqueryHtmlElementSelector;
        }

        add() {
          $(this.jqueryHtmlElement).html(htmlContentToAdd);
        }

        remove() {
            $(this.jqueryHtmlElement).empty();
        }
    }

    return Loader;
});
