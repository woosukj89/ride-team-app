import React, { useState, useMemo } from 'react';
import helper from "./service/helpers";
import userService from "./service/UserService";
import { adminConfig, columnsConfig, DefaultColumnFilter } from "./HistoryConfig";
import { mapHistoryData } from "./service/responseHandlers";
import { useTable, useFilters, useGroupBy, useExpanded } from "react-table";

const Report = (props) => {

    const date = new Date();
    const month = date.getMonth(), year = date.getFullYear();
    const firstDay = helper.getDate(new Date(year, month, 1));
    const lastDay = helper.getDate(new Date(year, month + 1, 0));

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);
    const [historyData, setHistoryData] = useState([]);

    const historyColumns = useMemo(() => columnsConfig(adminConfig), []);
    // console.log(columnsConfig(adminConfig));
    const groupByColumns = useMemo(() => ['rider', 'type'], []);
    const defaultFilter = useMemo(() => [{id: 'cancelled', value: '0'}], []);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const generateReport = () => {
        const params = {
            start_date: startDate,
            end_date: endDate
        };
        userService.getHistory(params).then(async (res) => {
            setHistoryData(await mapHistoryData(adminConfig, res.data));
        })
    };

    const aggregateDistances = (cell, key) => {
        if (cell.row.groupByID === "rider") {
            return cell.row.subRows.reduce((a, c) => a + c.values[key], 0.0);
        }
        else if (cell.row.groupByID === "type") {

        }
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { groupBy, expanded },
    } = useTable(
        {
            columns: historyColumns,
            data: historyData,
            initialState: {
                groupBy: groupByColumns,
                filters: defaultFilter
            }
        },
        useFilters,
        useGroupBy,
        useExpanded,
    );

    return (
        <div>
            <h2>Report</h2>
            <div>
                <div>
                    <label>Start Date:<input type="date"
                                             id="start-date"
                                             name="start-date"
                                             value={startDate} onChange={handleStartDateChange}/></label>
                    <label>End Date:<input type="date"
                                           id="end-date"
                                           name="end-date"
                                           value={endDate} onChange={handleEndDateChange}/></label>
                </div>
                <div>
                    <button onClick={generateReport}>Generate Report</button>
                </div>
                <div>
                    {historyData.length &&
                    <table {...getTableProps()}>
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>
                                        {column.canGroupBy ? (
                                            // If the column can be grouped, let's add a toggle
                                            <span {...column.getGroupByToggleProps()}>
                                              {column.isGrouped ? '🛑 ' : '👊 '}
                                            </span>
                                        ) : null}
                                        {column.render('Header')}
                                        <div>{column.canFilter && column.Filter ? column.render('Filter') : null}</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                // For educational purposes, let's color the
                                                // cell depending on what type it is given
                                                // from the useGroupBy hook
                                                {...cell.getCellProps()}
                                                style={{
                                                    background: cell.isGrouped
                                                        ? '#0aff0082'
                                                        : cell.isAggregated
                                                            ? '#ffa50078'
                                                            : cell.isPlaceholder
                                                                ? '#ff000042'
                                                                : 'white',
                                                }}
                                            >
                                                {cell.isGrouped ? (
                                                    // If it's a grouped cell, add an expander and row count
                                                    <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '👇' : '👉'}
                          </span>{' '}
                                                        {cell.render('Cell')} ({row.leafRows.length})
                                                    </>
                                                ) : cell.isAggregated ? (
                                                    // If the cell is aggregated, use the Aggregated
                                                    // renderer for cell
                                                    cell.render('Aggregated')
                                                ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                                                    // Otherwise, just render the regular cell
                                                    cell.render('Cell')
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default Report