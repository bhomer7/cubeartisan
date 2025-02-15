/**
 * This file is part of CubeArtisan.
 *
 * CubeArtisan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CubeArtisan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with CubeArtisan.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Modified from the original version in CubeCobra. See LICENSE.CubeCobra for more information.
 */
const combination = (n, r) => {
  const topArray = [];
  const botArray = [];
  const comboArray = [];

  for (let i = 1; i <= n; i++) {
    topArray.push(i);
  }
  for (let i = 1; i <= r; i++) {
    botArray.push(i);
  }
  for (let i = 1; i <= n - r; i++) {
    comboArray.push(i);
  }

  let sum = 1;

  for (let i = 0; i < Math.max(topArray.length, botArray.length, comboArray.length); i++) {
    if (topArray[i]) {
      sum *= topArray[i];
    }
    if (botArray[i]) {
      sum /= botArray[i];
    }
    if (comboArray[i]) {
      sum /= comboArray[i];
    }
  }
  return sum;
};

const hyp = (N, S, n, s) => {
  return (combination(S, s) * combination(N - S, n - s)) / combination(N, n);
};

const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};

const calculate = (populationSize, sampleSize, popSuccesses, sampleSuccesses) => {
  const keys = Array.from(Array(parseInt(sampleSuccesses, 10) + 1).keys());
  const values = keys.map((x) =>
    hyp(parseInt(populationSize, 10), parseInt(sampleSize, 10), parseInt(popSuccesses, 10), x),
  );
  const equalTo = clamp(values[values.length - 1], 0, 1);
  const lessThan = clamp(values.reduce((a, b) => a + b, 0) - equalTo, 0, 1);
  const lessThanEqual = clamp(lessThan + equalTo, 0, 1);
  const greaterThan = 1 - clamp(lessThanEqual, 0, 1);
  const greaterThanEqual = clamp(greaterThan + equalTo, 0, 1);

  return { equalTo, lessThan, lessThanEqual, greaterThan, greaterThanEqual };
};

export default calculate;
