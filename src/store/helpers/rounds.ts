/* eslint-disable operator-linebreak */
import { MistakeDefsState } from '@/store/mistake-defs/types.d';
import { RoundShot, Round, RoundHole } from '@/store/rounds/types.d';

const PUTT_CATEGORY_ID = 0;

function isPutt(shotId: number, mistakeDefsState: MistakeDefsState): boolean {
  const shotType = mistakeDefsState.mistakeDefs.find((type) => type.id === shotId);

  const shotCategory =
    mistakeDefsState.shotCategories.find((category) => category.id === shotType.categoryId);

  return shotCategory.id === PUTT_CATEGORY_ID;
}

function getRoundDetails(round: Round, shotTypeState: MistakeDefsState) {
  let totalShots = 0;
  let totalMistakes = 0;
  let totalPenalties = 0;
  let parForHolesPlayed = 0;
  let holesPlayed = 0;
  let totalPutts = 0;

  round.holes.forEach((hole: RoundHole) => {
    /*
     * Only count holes that have a par and have
     * shots that have been played
     */
    if (hole.shots.length && hole.par) {
      parForHolesPlayed += hole.par;
      holesPlayed += 1;
    }

    hole.shots.forEach((shot: RoundShot) => {
      if (shot.mistake) {
        totalMistakes += 1;
      }

      if (shot.addPenalty) {
        totalPenalties += 1;
      }

      if (isPutt(shot.shotId, shotTypeState)) {
        totalPutts += 1;
      }

      totalShots += 1;
    });
  });

  return {
    shots: totalShots,
    mistakes: totalMistakes,
    penalties: totalPenalties,
    score: parForHolesPlayed ? ((totalShots + totalPenalties) - parForHolesPlayed) : 0,
    holesPlayed,
    putts: totalPutts,
    par: parForHolesPlayed,
  };
}

export {
  getRoundDetails,
  isPutt,
};
