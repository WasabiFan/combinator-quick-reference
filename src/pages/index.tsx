import React from "react";
// @ts-ignore
import COMBINATORS_DATA_IMPORT from "../../content/combinators.yaml";

import Layout from "../components/layout";

interface Given {
    type: string;
    desc: string;
}

interface Combinator {
    have: string;
    want: string;
    panics?: boolean;
    candidates: string | string[];
    given: Given[];
}

interface AppData {
    entries: Combinator[];
}

const APP_DATA: AppData = preprocessData(COMBINATORS_DATA_IMPORT);

function preprocessData(importData: Combinator[]): AppData {
    const entries = [...importData].sort(
        (a, b) => a.have.localeCompare(b.have) || a.want.localeCompare(b.want)
        // TODO: sort given and other fields
    );

    return { entries };
}

interface TableRowProps {
    entry: Combinator
}

function TableRow({entry}: TableRowProps): JSX.Element {
    return <tr>
        <td>{entry.have}</td>
        <td>{entry.want}</td>
        <td>{entry.panics ? "panic" : "" }</td>
        <td>{JSON.stringify(entry.given)}</td>
        <td>{JSON.stringify(entry.candidates)}</td>
    </tr>
}
 
export default function Home() {
    return (
        <Layout>
            <table className="combinator-table">
                <tr>
                    <th rowSpan={2}>I have...</th>
                    <th id="want-header" colSpan={2}>I want...</th>
                    <th rowSpan={2}>I can provide...</th>
                    <th rowSpan={2}>...then you should use:</th>
                </tr>
                <tr>
                    <th className="want-subheader">Values</th>
                    <th className="want-subheader">Side-effects</th>
                </tr>
                { APP_DATA.entries.map(e => <TableRow entry={e}/>) }
            </table>
        </Layout>
    );
}
