/**
 * Piecewise-linear map of `v` from `input` to `output`, clamped at both ends.
 * Use it inside `useTransform(value, (v) => interpolate(...))` for scroll-linked styles:
 * motion's native scroll-timeline path maps ranges incorrectly for sticky targets.
 */
export function interpolate(v: number, input: readonly number[], output: readonly number[]) {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + (output[i] - output[i - 1]) * t;
    }
  }
  return output[output.length - 1];
}
