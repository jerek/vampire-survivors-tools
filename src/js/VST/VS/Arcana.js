/**
 * Functions related to Vampire Survivors arcanas.
 */
VST.VS.Arcana = new function () {
    const DOM = VST.DOM;
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {number} The standard scaling size of arcana card images. */
    const IMAGE_SCALE_CARDS = 1.6;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the arcana with the given ID.
     *
     * @param {ArcanaId} id
     * @return {ArcanaData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_ARCANA, id);

    /**
     * Returns a list of all arcana IDs.
     *
     * @return {ArcanaId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_ARCANA);

    /**
     * Appends an arcana card image to the given parent element.
     *
     * @param {ArcanaData} arcana
     * @param {Node}       appendTo
     * @param {number}     [scale]          The 1-base scale at which images should be displayed. Default: 2
     * @param {string}     [tagName="span"] The tag name to use for the element.
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.renderCard = function (arcana, appendTo, tagName, scale) {
        // By default, the styles are based only on this class and its extensions.
        let baseClass = 'vs-arcana-card';

        if (!scale) {
            scale = IMAGE_SCALE_CARDS;
        }

        let wrapper = DOM.ce(tagName || 'span', {
            className: baseClass,
            dataset: {
                id: arcana.id,
            },
        }, appendTo);

        let image = Img.createImage(Img.ARCANA, getCardImageFilename(arcana.id), wrapper, scale);
        image.classList.add(`${baseClass}-image`);

        DOM.createTooltip(arcana.description, wrapper);

        return wrapper;
    };

    /**
     * Returns the filename to display an arcana card image for the given arcana ID.
     *
     * @param {ArcanaId} id
     * @return {string}
     */
    function getCardImageFilename(id) {
        id--;
        let baseName = id < 10 ? `0${id}` : id;

        return `${baseName}.png`;
    }
};
