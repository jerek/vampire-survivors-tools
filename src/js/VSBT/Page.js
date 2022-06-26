/**
 * Manages rendering the page and different page layouts.
 */
VSBT.Page = new function () {
    const self = this;
    const Img = VSBT.Img;
    const DOM = VSBT.DOM;

    // *********************** //
    // ***** DEFINITIONS ***** //
    // *********************** //

    /**
     * @typedef {Object} HomepageNavigation Data to display a button link to a page in the general navigation area.
     * @property {string}      buttonText    The text to display in its button.
     * @property {PageId}      page          The page that the button links to.
     * @property {ButtonColor} [buttonColor] The color of the button on the homepage.
     */

    /**
     * @typedef {Object} PageBundle Data describing a page to display and any associated contextual data.
     * @property {PageId}   page The page to display.
     * @property {PageData} data Page-specific contextual data.
     */

    /**
     * @typedef {Object} PageConfig The basic data needed to display a page.
     * @property {function} display Renders the page for the user.
     * @property {PageId}   id      The page ID.
     * @property {string}   title   The page title, shown in the main heading and <title> tag.
     * @property {string}   [url]   The URL where the page is seen. The error page doesn't change the URL.
     */

    /** @typedef {*} PageData Page-specific contextual data. */

    /** @typedef {string} PageId A string ID of a page with an associated layout. */

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    // ------ //
    // PUBLIC //
    // ------ //

    // Constants to identify the different page layouts.
    /** @type {PageId} */ this.PAGE_GAME_IMAGES = 'game-images';
    /** @type {PageId} */ this.PAGE_GAME_IMAGES_ANIMATED = 'game-images-animated';
    /** @type {PageId} */ this.PAGE_ERROR = 'error';
    /** @type {PageId} */ this.PAGE_INDEX = 'index';

    // ------- //
    // PRIVATE //
    // ------- //

    /** @type {HomepageNavigation[]} The page links displayed on the homepage. */
    const HOMEPAGE_NAVIGATION = [
        {page: this.PAGE_GAME_IMAGES, buttonText: 'Game Images'},
        {page: this.PAGE_GAME_IMAGES_ANIMATED, buttonText: 'Animated Images'},
    ];

    /** @type {Object<PageId, PageConfig>} A map of page IDs to their configurations. */
    const PAGES = {
        [this.PAGE_ERROR]: {
            id: this.PAGE_ERROR,
            title: 'Error',
            display:
                /**
                 * @param {PageId}          page
                 * @param {{error: string}} [data]
                 */
                (page, data) => {
                    DOM.ce('h2', undefined, my.elements.container, DOM.ct(data && data.error || 'Unknown Error'));
                },
        },
        [this.PAGE_GAME_IMAGES]: {
            id: this.PAGE_GAME_IMAGES,
            title: 'Vampire Survivors Images',
            url: 'game-images',
            display:
                /**
                 * @param {PageId}       page
                 * @param {VsSpriteName} [data]
                 */
                (page, data) => {
                    if (data) {
                        Img.displayAllImages(data);
                    } else {
                        let buttons = DOM.ce('div', {className: 'vs-button-list'}, my.elements.container);
                        let spriteNames = Img.getSpriteNames().concat([Img.ALL_SPRITES]);
                        spriteNames.forEach(spriteName => {
                            DOM.createButton(spriteName, () => self.set(self.PAGE_GAME_IMAGES, spriteName), buttons);
                        });
                    }
                },
        },
        [this.PAGE_GAME_IMAGES_ANIMATED]: {
            id: this.PAGE_GAME_IMAGES_ANIMATED,
            title: 'Vampire Survivors Images Animated',
            url: 'game-images/animated',
            display:
                /**
                 * @param {PageId}       page
                 * @param {VsSpriteName} [data]
                 */
                (page, data) => {
                    if (data) {
                        Img.displayAllImagesAnimated(data);
                    } else {
                        let buttons = DOM.ce('div', {className: 'vs-button-list'}, my.elements.container);
                        let spriteNames = Img.getSpriteNames().concat([Img.ALL_SPRITES]);
                        spriteNames.forEach(spriteName => {
                            DOM.createButton(spriteName, () => self.set(self.PAGE_GAME_IMAGES_ANIMATED, spriteName), buttons);
                        });
                    }
                },
        },
        [this.PAGE_INDEX]: {
            id: this.PAGE_INDEX,
            title: 'Vampire Survivors Build Tool',
            url: 'build-tool',
            display: () => {
                let navRow = addNavigationRow();

                HOMEPAGE_NAVIGATION.forEach(navItem => {
                    DOM.createButton(
                        navItem.buttonText,
                        () => self.set(navItem.page),
                        navRow,
                        navItem.buttonColor,
                    );
                });
            },
        },
    };

    // ********************* //
    // ***** VARIABLES ***** //
    // ********************* //

    /** @type {Object} Private object-scope variables. */
    const my = {
        /** @type {PageBundle|undefined} The currently loaded page. */
        currentPage: undefined,

        /** @type {Object} References to various DOM elements. */
        elements: {
            /** @type {HTMLDivElement} The main element containing the tool's interactive elements. */
            container: undefined,

            /** @type {HTMLHeadingElement} The main page heading. */
            pageHeading: undefined,
        },

        /** @type {function[]} A list of functions to call before changing to another page. */
        onLeavePage: [],

        /** @type {PageBundle[]} The previous pages that the user can go back to. */
        previousPages: [],
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

        self.set(self.PAGE_INDEX);

        let footer = DOM.ce('footer', undefined, document.body, DOM.ct('Created for the Survivors by '));
        DOM.ce('a', {href: 'https://twitter.com/jerekdain', target: '_blank'}, footer, DOM.ct('Jerek Dain'));
    };

    /**
     * Registers the given callback to be called when the user visits a different page. This is so that pages can do any
     * needed manual garbage collection to prevent memory leaks, such as clearing animation intervals.
     *
     * @param {function} callback
     */
    this.onLeavePage = function (callback) {
        my.onLeavePage.push(callback);
    };

    /**
     * Sets and displays a page.
     *
     * @param {PageId}   page            The page to display.
     * @param {PageData} [data]          Page-specific contextual data.
     * @param {boolean}  [viaBackButton] Whether this page is being loaded because the user used the back button.
     */
    this.set = function (page, data, viaBackButton) {
        // Do any garbage collection and clear any previous page content.
        while (my.onLeavePage.length) {
            my.onLeavePage.shift()();
        }
        my.elements.container.innerHTML = '';

        // Set the new page.
        let pageConfig = PAGES[page];
        if (!pageConfig) {
            self.set(self.PAGE_ERROR, {error: 'Page Not Found'});

            return;
        }
        if (viaBackButton) {
            my.previousPages.pop();
        } else if (my.currentPage) {
            my.previousPages.push(my.currentPage);
        }
        my.currentPage = {page: page, data: data};
        document.body.dataset.page = page;

        // Update the main heading.
        my.elements.pageHeading.innerText = pageConfig.title;

        // Add a red "Back" button to go back to the previous page.
        if (my.previousPages.length) {
            let navRow = addNavigationRow();

            DOM.createButton(
                'Back',
                () => {
                    let lastPage = my.previousPages[my.previousPages.length - 1];
                    self.set(lastPage.page, lastPage.data, true);
                },
                navRow,
                DOM.BUTTON_RED,
            );
        }

        // Display the page content.
        pageConfig.display(page, data);
    };

    // ------- //
    // PRIVATE //
    // ------- //

    /**
     * Creates and returns a navigation row in the main container.
     *
     * @return {HTMLDivElement}
     */
    function addNavigationRow() {
        return DOM.ce('div', {className: 'vsbt-nav'}, my.elements.container);
    }
};
