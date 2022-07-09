/**
 * Functions related to Vampire Survivors arcanas.
 */
VST.VS.Arcana = new function () {
    const Img = VST.VS.Img;
    const VS = VST.VS;

    // ********************* //
    // ***** CONSTANTS ***** //
    // ********************* //

    /** @type {number} The standard scaling size of arcana card images. */
    const IMAGE_SCALE_CARDS = 1.5;

    /** @type {VsType} The entity type that this class is associated with. */
    const TYPE = VS.TYPE_ARCANA;

    // ********************* //
    // ***** FUNCTIONS ***** //
    // ********************* //

    /**
     * Returns the arcana with the given ID.
     *
     * @param {ArcanaId} id
     * @return {ArcanaData|undefined}
     */
    this.get = id => VS.getData(TYPE, id);

    /**
     * Returns a list of all arcana IDs.
     *
     * @return {ArcanaId[]}
     */
    this.getIds = () => VS.getIds(TYPE);

    /**
     * Returns elements created to display an arcana card.
     *
     * @param {ArcanaData} arcana
     * @param {string}     [tagName="div"] The tag name to use for the element.
     * @param {number}     [scale]         The 1-base scale at which images should be displayed. Default: 2
     * @return {HTMLSpanElement|HTMLElement}
     */
    this.renderCard = function (arcana, tagName, scale) {
        if (!scale) {
            scale = IMAGE_SCALE_CARDS;
        }

        let entity = VS.createEntityElements(TYPE, arcana, tagName);

        entity.content.appendChild(Img.createImage(Img.ARCANA, getCardImageFilename(arcana.id), scale));

        entity.wrapper.appendChild(VS.createTooltip(arcana));

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
