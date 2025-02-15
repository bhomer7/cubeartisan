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
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { CSVLink } from 'react-csv';

import HeaderCell from '@cubeartisan/client/components/HeaderCell.js';
import useSortableData from '@cubeartisan/client/hooks/UseSortableData.js';

export const valueRenderer = (value) => {
  if (!Number.isFinite(value) || Number.isInteger(value)) {
    return value;
  }
  return value.toFixed(2);
};

export const percentRenderer = (value) => <span>{valueRenderer(value * 100)}%</span>;

export const compareStrings = (a, b) => a?.toString?.()?.localeCompare?.(b?.toString?.());

export const SortableTable = ({ data, defaultSortConfig, sortFns, columnProps, totalRow, totalCol, ...props }) => {
  const { items, requestSort, sortConfig } = useSortableData(data, defaultSortConfig, sortFns);

  const exportData = useMemo(
    () =>
      data.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => {
            if (value?.exportValue) {
              return [key, value?.exportValue];
            }
            return [key, value];
          }),
        ),
      ),
    [data],
  );

  return (
    <>
      <CSVLink data={exportData} filename="export.csv">
        Download CSV
      </CSVLink>
      <Table bordered responsive {...props}>
        <thead>
          <tr>
            {columnProps.map(({ title, key, sortable, heading, tooltip }) => {
              if (sortable) {
                return (
                  <HeaderCell
                    key={key}
                    fieldName={key}
                    label={title}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    tooltip={tooltip}
                    className={heading ? 'corner' : ''}
                  />
                );
              }
              if (heading) {
                return (
                  <th key={key} scope="col">
                    {title}
                  </th>
                );
              }
              return <td key={key}>{title}</td>;
            })}
          </tr>
        </thead>
        <tbody className="breakdown">
          {items.map((row, idx) => (
            <tr key={`row-${idx}` /* eslint-disable-line react/no-array-index-key */}>
              {columnProps.map(({ key, heading, renderFn }) =>
                heading ? (
                  <th scope="row" key={key}>
                    {(renderFn ?? valueRenderer)(row[key], row, key)}
                  </th>
                ) : (
                  <td key={key}>{(renderFn ?? valueRenderer)(row[key], row, key)}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

SortableTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  defaultSortConfig: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['ascending', 'descending']).isRequired,
  }),
  sortFns: PropTypes.shape({}),
  columnProps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      heading: PropTypes.bool,
      tooltip: PropTypes.string,
      renderFunc: PropTypes.func,
    }).isRequired,
  ).isRequired,
  totalRow: PropTypes.bool,
  totalCol: PropTypes.bool,
};
SortableTable.defaultProps = {
  defaultSortConfig: null,
  sortFns: {},
  totalRow: false,
  totalCol: false,
};

export default SortableTable;
