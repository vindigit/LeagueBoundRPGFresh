export type TuningRangeError = {
  minKey: string;
  maxKey: string;
  minValue: number;
  maxValue: number;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const getRangeError = (input: TuningRangeError): Error =>
  new Error(
    `Invalid match engine tuning range: ${input.minKey} (${input.minValue}) must be < ${input.maxKey} (${input.maxValue}).`,
  );

export const validateMatchEngineTuning = (tuning: Record<string, unknown>): void => {
  for (const minKey of Object.keys(tuning)) {
    if (!minKey.endsWith("Min")) {
      continue;
    }

    const maxKey = `${minKey.slice(0, -3)}Max`;
    if (!(maxKey in tuning)) {
      continue;
    }

    const minValue = tuning[minKey];
    const maxValue = tuning[maxKey];
    if (!isFiniteNumber(minValue) || !isFiniteNumber(maxValue)) {
      continue;
    }

    if (minValue >= maxValue) {
      throw getRangeError({
        minKey,
        maxKey,
        minValue,
        maxValue,
      });
    }
  }
};
