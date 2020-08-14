import React from "react";

// @ts-ignore
import COMBINATORS_DATA_IMPORT from "../../content/combinators.yaml";

import Layout from "../components/layout";
import HighlightedType from "../components/types";

import "../../styles/index.scss";

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

interface Section {
    header: string;
    items: Combinator[];
}

interface AppData {
    sections: Section[];
}

const APP_DATA: AppData = preprocessData(COMBINATORS_DATA_IMPORT);

function preprocessData(importData: Section[]): AppData {
    return { sections: importData };
}

interface TableRowProps {
    entry: Combinator;
}

interface GivenProps {
    value: Given;
}

interface CandidateProps {
    fn: string;
}

interface CandidateListProps {
    fns: string | string[];
}

function Given({ value }: GivenProps): JSX.Element {
    return (
        <div className="given-container">
            <code>
                <HighlightedType type={value.type} />
            </code>
            <span className="given-desc">{value.desc}</span>
        </div>
    );
}

function Candidate({ fn }: CandidateProps): JSX.Element {
    return (
        <div>
            <code>
                <HighlightedType type={fn} />
            </code>
        </div>
    );
}

function CandidateList({ fns }: CandidateListProps): JSX.Element {
    if (Array.isArray(fns)) {
        return (
            <>
                {fns.map(c => (
                    <Candidate key={c} fn={c} />
                ))}
            </>
        );
    } else {
        return <Candidate fn={fns} />;
    }
}

function TableRow({ entry }: TableRowProps): JSX.Element {
    return (
        <tr>
            <td>
                <code>
                    <HighlightedType type={entry.have}></HighlightedType>
                </code>
            </td>
            <td>
                <code>
                    <HighlightedType type={entry.want}></HighlightedType>
                </code>{" "}
                {entry.panics && "or panic"}
            </td>
            <td>
                {(entry.given || []).map(g => (
                    <Given key={g.type} value={g} />
                ))}
            </td>
            <td>
                <CandidateList fns={entry.candidates} />
            </td>
        </tr>
    );
}

export default function Home() {
    return (
        <Layout>
            <table className="combinator-table">
                <thead className="primary-header">
                    <tr>
                        <th>I have</th>
                        <th>I want</th>
                        <th>I can provide</th>
                        <th>...then I should use:</th>
                    </tr>
                </thead>
                {APP_DATA.sections.map(s => (
                    <React.Fragment key={s.header}>
                        <thead className="section-header">
                            <tr>
                                <th colSpan={4}>{s.header}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {s.items.map(e => (
                                <TableRow key={JSON.stringify(e)} entry={e} />
                            ))}
                        </tbody>
                    </React.Fragment>
                ))}
            </table>
        </Layout>
    );
}
