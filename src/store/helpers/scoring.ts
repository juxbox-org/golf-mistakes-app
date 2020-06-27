import { RoundHole } from '@/store/rounds/types.d';

const PUTT_CATEGORY_ID = 0;

function numMistakes(hole: RoundHole) {
  let mistakeCount = 0;

  hole.shots.forEach((shot) => {
    if (shot.addPenalty) {
      mistakeCount += 1;
    }
  });

  return mistakeCount;
}

function isGir(hole: RoundHole): boolean {
  if (hole.shots.length) {
    // Holed-out or on green in fewer shots than expected, so count as a GIR
    if (hole.shots.length <= hole.par - 2) {
      return true;
    }

    if (hole.shots[hole.par - 3].categoryId !== PUTT_CATEGORY_ID
       && hole.shots[hole.par - 2].categoryId === PUTT_CATEGORY_ID) {
      return true;
    }
  }

  return false;
}

function isPar(hole: RoundHole) {
  if (hole.shots.length) {
    return hole.shots.length + numMistakes(hole) === hole.par;
  }

  return false;
}

function isBirdie(hole: RoundHole) {
  if (hole.shots.length) {
    return hole.shots.length + numMistakes(hole) === hole.par - 1;
  }

  return false;
}

function isEagleOrBetter(hole: RoundHole) {
  if (hole.shots.length) {
    return hole.shots.length + numMistakes(hole) <= hole.par - 2;
  }

  return false;
}

function isBogey(hole: RoundHole) {
  if (hole.shots.length) {
    return hole.shots.length + numMistakes(hole) === hole.par + 1;
  }

  return false;
}

function isDoubleBogey(hole: RoundHole) {
  if (hole.shots.length) {
    return hole.shots.length + numMistakes(hole) === hole.par + 2;
  }

  return false;
}

function isTripleBogeyOrWorse(hole: RoundHole) {
  if (hole.shots.length) {
    return hole.shots.length + numMistakes(hole) >= hole.par + 3;
  }

  return false;
}

export {
  isGir,
  isPar,
  isBirdie,
  isEagleOrBetter,
  isBogey,
  isDoubleBogey,
  isTripleBogeyOrWorse,
};
