import React, { useState, useEffect, useMemo } from "react";
import {
    riderConfig,
    rideeConfig,
    adminConfig,
    columnsConfig
} from "./HistoryConfig";
import userService from "./service/UserService";
import { mapHistoryData } from "./service/responseHandlers";
import { useTable } from "react-table";
import { Link } from "react-router-dom";

const History = (props) => {

    let historyConfig;

    switch(props.role) {
        case 'rider':
            historyConfig = riderConfig;
            break;
        case 'ridee':
            historyConfig = rideeConfig;
            break;
        case 'admin':
            historyConfig = adminConfig;
            break;
        default:
            break;
    }

    const [historyData, setHistoryData] = useState([]);

    const createHistoryData = useMemo(() => historyData, [historyData]);
    const createHistoryColumns = useMemo(() => columnsConfig(historyConfig), []);

    useEffect(() => {

        const params = {};

        if (props.role !== "admin") {
            params['userID'] = props.userID;
            params['role'] = props.role;
        }

        userService.getHistory(params).then(async (res) => {
            const data = res.data;
            setHistoryData(await mapHistoryData(historyConfig, data));
        });

    }, [historyConfig, props.userID, props.role]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns: createHistoryColumns,
        data: createHistoryData,
    });

    return (
        <div>
            <div>
                {/*<div>*/}
                {/*    Total Travelled Miles: {totalMiles}*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    Total Count: {totalCount}*/}
                {/*</div>*/}
            </div>
            <div>
                <div>
                    <table {...getTableProps}>
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                    <td>
                                        {/*<Link to={{*/}
                                        {/*    pathname: "/ride-detail",*/}
                                        {/*    query: {recordID: row.original.id, status: "history"}*/}
                                        {/*}}>View Ride Details</Link>*/}
                                        <Link to={"ride-detail/" + row.original.id}>
                                            View Ride Detail
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                        {/*<tr>*/}
                        {/*    <Link to={{*/}
                        {/*        pathname: "/ride-detail",*/}
                        {/*        query: {recordID: recordID, status: "history"}*/}
                        {/*    }}>View Ride Details</Link>*/}
                        {/*</tr>*/}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default History;