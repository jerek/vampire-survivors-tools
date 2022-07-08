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
     * Returns elements created to display an arcana card.
     *
     * @param {ArcanaData} arcana
     * @param {string}     [tagName="span"] The tag name to use for the element.
     * @param {number}     [scale]          The 1-base scale at which images should be displayed. Default: 2
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.renderCard = function (arcana, tagName, scale) {
        if (!scale) {
            scale = IMAGE_SCALE_CARDS;
        }

        let entity = VS.createEntityElements(VS.TYPE_ARCANA, arcana, tagName);

        entity.content.appendChild(Img.createImage(Img.ARCANA, getCardImageFilename(arcana.id), scale));

        entity.wrapper.appendChild(DOM.createTooltip(arcana.description));

        return entity.wrapper;
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
