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

function codeSimplicitySort(a: string, b: string): number {
    if (a.length == b.length) {
        return a.localeCompare(b);
    } else {
        return a.length - b.length;
    }
}

function preprocessData(importData: Combinator[]): AppData {
    const entries = [...importData].sort(
        (a, b) => codeSimplicitySort(a.have, b.have) || codeSimplicitySort(a.want, b.want)
        // Remaining fields are left in provided order
    );

    return { entries };
}

interface TableRowProps {
    entry: Combinator
}

interface GivenProps {
    value: Given
}

interface CandidateProps {
    fn: string
}

interface CandidateListProps {
    fns: string | string[]
}

function Given({ value }: GivenProps): JSX.Element {
    return <div className="given-container">
        <code>{value.type}</code>
        <span className="given-desc">{value.desc}</span>
    </div>
}

function Candidate({ fn }: CandidateProps): JSX.Element {
    return <div><code>{fn}</code></div>
}

function CandidateList({ fns }: CandidateListProps): JSX.Element {
    if (Array.isArray(fns)) {
        return <>{fns.map(c => <Candidate fn={c}/>)}</>
    } else {
        return <Candidate fn={fns}/>;
    }
}

function TableRow({ entry }: TableRowProps): JSX.Element {
    return <tr>
        <td><code>{entry.have}</code></td>
        <td><code>{entry.want}</code></td>
        <td>{entry.panics ? <span className="panic"/> : "" }</td>
        <td>{(entry.given || []).map(g => <Given value={g} />)}</td>
        <td><CandidateList fns={entry.candidates} /></td>
    </tr>
}
 
export default function Home() {
    return (
        <Layout>
            <table className="combinator-table">
                <tr>
                    <th rowSpan={2}>I have</th>
                    <th id="want-header" colSpan={2}>I want</th>
                    <th rowSpan={2}>I can provide</th>
                    <th rowSpan={2}>...then I should use:</th>
                </tr>
                <tr>
                    <th className="want-subheader">Value</th>
                    <th className="want-subheader">Side-effects</th>
                </tr>
                { APP_DATA.entries.map(e => <TableRow entry={e}/>) }
            </table>
        </Layout>
    );
}
