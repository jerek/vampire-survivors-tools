/**
 * Functions related to Vampire Survivors characters.
 */
VST.VS.Character = new function () {
    const VS = VST.VS;

    /**
     * Returns the character with the given ID.
     *
     * @param {CharacterId} id
     * @return {CharacterData|undefined}
     */
    this.get = id => VS.getData(VS.TYPE_CHARACTER, id);

    /**
     * Returns a list of all character IDs.
     *
     * @return {CharacterId[]}
     */
    this.getIds = () => VS.getIds(VS.TYPE_CHARACTER);
};
