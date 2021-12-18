import Nt from "ntseq";

/**
 * Align match sequence with bases in an array of sequence objects
 *
 * @param {Array} seqData Array of sequence objects
 * @param {String} seqMatch String to match
 * @returns Array of sequence objects with matching index data
 */
export const getMatchIndices = (seqData, seqMatch) => {
  const querySeq = new Nt.Seq().read(seqMatch);

  return seqData.map((seqData) => {
    const seq = new Nt.Seq().read(seqData.bases);
    const map = seq.mapSequence(querySeq).initialize().sort();
    seqData.matchIndices = [];

    const { __orderedResults: orderedResults } = map;

    let i = 0;
    while (orderedResults[i].s === seqMatch.length && seqMatch.length > 1) {
      seqData.matchIndices.push(orderedResults[i].n);
      i += 1;
    }
    return seqData;
  });
};
