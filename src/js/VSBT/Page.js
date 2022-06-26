/**
 * Manages rendering the page and different page layouts.
 */
VSBT.Page = new function () {
    const self = this;
    const DOM = VSBT.DOM;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /** @typedef {string} Page A page with an associated layout. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    // Constants to identify the different page layouts.
    /** @type {Page} */ this.PAGE_ALL_IMAGES = 'all-images';
    /** @type {Page} */ this.PAGE_ALL_IMAGES_ANIMATED = 'all-images-animated';
    /** @type {Page} */ this.PAGE_INDEX = 'index';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {Object<Page, string>} A map of pages to their titles. */
    const PAGE_TITLES = {
        [this.PAGE_ALL_IMAGES]: 'Vampire Survivors Images',
        [this.PAGE_ALL_IMAGES_ANIMATED]: 'Vampire Survivors Images Animated',
        [this.PAGE_INDEX]: 'Vampire Survivors Build Tool',
    };

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {Page} The currently loaded page. */
        currentPage: undefined,

        /** @type {Object} References to various DOM elements. */
        elements: {
            /** @type {HTMLDivElement} The main element containing the tool's interactive elements. */
            container: undefined,

            /** @type {HTMLHeadingElement} The main page heading. */
            pageHeading: undefined,
        },
    };

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    /**
     * Returns the main element containing the tool's interactive elements.
     *
     * @return {HTMLDivElement}
     */
    this.getContainer = function () {
        return my.elements.container;
    };

    /**
     * Sets up the tool's elements.
     */
    this.init = function () {
        my.elements.pageHeading = DOM.ce('h1', undefined, document.body);

        let wrapper = DOM.ce('div', {className: 'vsbt'}, document.body);
        my.elements.container = DOM.ce('div', {className: 'vsbt-container'}, wrapper);

        self.setPage(self.PAGE_INDEX);

        let footer = DOM.ce('footer', undefined, document.body, DOM.ct('Created for the Survivors by '));
        DOM.ce('a', {href: 'https://twitter.com/jerekdain', target: '_blank'}, footer, DOM.ct('Jerek Dain'));
    };

    /**
     * Sets and displays a page.
     *
     * @param {Page} page
     */
    this.setPage = function (page) {
        my.currentPage = page;

        my.elements.container.innerHTML = '';

        addNavigationButtons(page);

        my.elements.pageHeading.innerText = PAGE_TITLES[page] || PAGE_TITLES[self.PAGE_INDEX];

        switch (page) {
            case this.PAGE_ALL_IMAGES:
                VSBT.Img.displayAllImages();
                break;
            case this.PAGE_ALL_IMAGES_ANIMATED:
                VSBT.Img.displayAllImagesAnimated();
                break;
            case this.PAGE_INDEX:
                DOM.ce('p', undefined, my.elements.container, DOM.ct('One day, this will have meaningful text. Today ' +
                    'is not that day.'));
                break;
        }
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Add navigation buttons to the main container.
     *
     * @param {Page} page
     */
    function addNavigationButtons(page) {
        let nav = DOM.ce('div', {className: 'vsbt-nav'}, my.elements.container);
        let addSpace = () => nav.appendChild(DOM.ct(' '));
        if (page !== self.PAGE_INDEX) {
            DOM.createButton('Back', () => self.setPage(self.PAGE_INDEX), nav, DOM.BUTTON_RED);
            addSpace();
        }
        DOM.createButton('Display All Images', () => self.setPage(self.PAGE_ALL_IMAGES), nav);
        addSpace();
        DOM.createButton('Display All Images Animated', () => self.setPage(self.PAGE_ALL_IMAGES_ANIMATED), nav);
    }
};
