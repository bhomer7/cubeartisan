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
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Col, Row, InputGroup, InputGroupAddon, InputGroupText, CustomInput } from 'reactstrap';

import AsfanDropdown from '@cubeartisan/client/components/AsfanDropdown.js';
import ErrorBoundary from '@cubeartisan/client/components/ErrorBoundary.js';
import { SortableTable, compareStrings, valueRenderer } from '@cubeartisan/client/components/SortableTable.js';
import useQueryParam from '@cubeartisan/client/hooks/useQueryParam.js';
import CardPropType from '@cubeartisan/client/proptypes/CardPropType.js';
import CubePropType from '@cubeartisan/client/proptypes/CubePropType.js';
import { SORTS, cardCanBeSorted, sortGroupsOrdered } from '@cubeartisan/client/utils/Sort.js';

const sortWithTotal = (pool, sort) =>
  [...sortGroupsOrdered(pool, sort), ['Total', pool]].map(([label, cards]) => [
    label,
    cards.reduce((acc, card) => acc + card.asfan, 0),
  ]);

const AnalyticTable = ({ cards: allCards, cube, defaultFormatId, setAsfans }) => {
  const [column, setColumn] = useQueryParam('column', 'Color Identity');
  const [row, setRow] = useQueryParam('row', 'Type');
  const [percentOf, setPercentOf] = useQueryParam('percentOf', 'total');

  // some criteria cannot be applied to some cards
  const cards = useMemo(
    () => allCards.filter((card) => cardCanBeSorted(card, column) && cardCanBeSorted(card, row)),
    [allCards, column, row],
  );
  const [columnCounts, columnLabels] = useMemo(() => {
    const counts = sortWithTotal(cards, column).filter(([label, count]) => label === 'Total' || count > 0);
    return [Object.fromEntries(counts), counts.map(([label]) => label)];
  }, [cards, column]);
  const rows = useMemo(
    () =>
      [...sortGroupsOrdered(cards, row), ['Total', cards]]
        .map(([label, groupCards]) => [label, Object.fromEntries(sortWithTotal(groupCards, column))])
        .map(([rowLabel, columnValues]) => ({
          rowLabel,
          ...Object.fromEntries(columnLabels.map((label) => [label, columnValues[label] ?? 0])),
        })),
    [cards, column, row, columnLabels],
  );

  const entryRenderer = useCallback(
    (value, { Total: rowTotal }, columnLabel) => {
      value = Number.isFinite(value) ? value : 0;
      let scalingFactor = null;
      if (percentOf === 'total') scalingFactor = 100 / columnCounts.Total;
      else if (percentOf === 'row') scalingFactor = 100 / rowTotal;
      else if (percentOf === 'column') scalingFactor = 100 / columnCounts[columnLabel];
      return (
        <>
          {valueRenderer(value)}
          {scalingFactor && <span className="percent">{valueRenderer(value * scalingFactor)}%</span>}
        </>
      );
    },
    [columnCounts, percentOf],
  );

  const columnProps = useMemo(
    () => [
      { key: 'rowLabel', title: row, heading: true, sortable: true },
      ...columnLabels.map((title) => ({ key: title, title, heading: false, sortable: true, renderFn: entryRenderer })),
    ],
    [entryRenderer, columnLabels, row],
  );

  return (
    <>
      <Row>
        <Col>
          <h4 className="d-lg-block d-none">Table</h4>
          <p>View card counts and percentages.</p>
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Columns: </InputGroupText>
            </InputGroupAddon>
            <CustomInput
              id="columnSort"
              type="select"
              value={column}
              onChange={(event) => setColumn(event.target.value)}
            >
              {SORTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Rows: </InputGroupText>
            </InputGroupAddon>
            <CustomInput id="rowSort" type="select" value={row} onChange={(event) => setRow(event.target.value)}>
              {SORTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Show Percent Of: </InputGroupText>
            </InputGroupAddon>
            <CustomInput
              id="percentOf"
              type="select"
              value={percentOf}
              onChange={(event) => setPercentOf(event.target.value)}
            >
              <option key="total" value="total">
                Total
              </option>
              <option key="row" value="row">
                Row Total
              </option>
              <option key="column" value="column">
                Column Total
              </option>
              <option key="none" value="none">
                No Percent
              </option>
            </CustomInput>
          </InputGroup>
        </Col>
      </Row>
      <AsfanDropdown cube={cube} defaultFormatId={defaultFormatId} setAsfans={setAsfans} />
      <ErrorBoundary>
        <SortableTable columnProps={columnProps} data={rows} sortFns={{ rowLabel: compareStrings }} />
      </ErrorBoundary>
    </>
  );
};

AnalyticTable.propTypes = {
  cards: PropTypes.arrayOf(CardPropType.isRequired).isRequired,
  cube: CubePropType.isRequired,
  defaultFormatId: PropTypes.number,
  setAsfans: PropTypes.func.isRequired,
};
AnalyticTable.defaultProps = {
  defaultFormatId: null,
};

export default AnalyticTable;
