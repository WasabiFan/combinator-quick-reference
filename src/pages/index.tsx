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
        (a, b) =>
            codeSimplicitySort(a.have, b.have) ||
            codeSimplicitySort(a.want, b.want)
        // Remaining fields are left in provided order
    );

    return { entries };
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

interface HighlightedTypeProps {
    type: string;
}

interface HighlightedTypePartProps {
    typeNode: TypeNode;
}

interface TypeNode {
    name: string;
    generics?: TypeNode[];
}

const ANCHORED_IDENTIFIER_WITH_GENERICS_REGEX = /^([a-zA-Z]+)(?:<(?:((?:[^<>]|<.*>)*),)*(.*)>)?/;
function parseType(type: string): TypeNode {
    const match = ANCHORED_IDENTIFIER_WITH_GENERICS_REGEX.exec(type) ?? [];
    const [, ...groups] = [...match];

    if (groups.length < 1) {
        throw new Error("Parse error");
    }

    const generics = groups
        .slice(1)
        .filter(str => str != undefined)
        .map(str => parseType(str.trim()));

    return {
        name: groups[0].trim(),
        generics: generics.length ? generics : undefined,
    };
}

function Given({ value }: GivenProps): JSX.Element {
    return (
        <div className="given-container">
            <code>{value.type}</code>
            <span className="given-desc">{value.desc}</span>
        </div>
    );
}

function Candidate({ fn }: CandidateProps): JSX.Element {
    return (
        <div>
            <code>{fn}</code>
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

function commaJoin(elements: JSX.Element[]): JSX.Element | null {
    return elements.reduce<JSX.Element | null>(
        (acc, x) =>
            acc === null ? (
                x
            ) : (
                <>
                    {acc}, {x}
                </>
            ),
        null
    );
}

function HighlightedTypePart({
    typeNode,
}: HighlightedTypePartProps): JSX.Element {
    if (typeNode.generics) {
        return (
            <>
                <span className={`code-concrete-type`}>{typeNode.name}</span>
                {"<"}
                {commaJoin(
                    typeNode.generics.map(v => (
                        <HighlightedTypePart
                            key={JSON.stringify(v)}
                            typeNode={v}
                        />
                    ))
                )}
                {">"}
            </>
        );
    } else {
        if (["T", "U", "D", "E", "F"].includes(typeNode.name)) {
            return (
                <span
                    className={`code-generic-param code-generic-param-${typeNode.name}`}
                >
                    {typeNode.name}
                </span>
            );
        } else {
            return (
                <span className={`code-concrete-type`}>{typeNode.name}</span>
            );
        }
    }
}

function HighlightedType({ type }: HighlightedTypeProps): JSX.Element {
    return <HighlightedTypePart typeNode={parseType(type)} />;
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
                <thead>
                    <tr>
                        <th>I have</th>
                        <th>I want</th>
                        <th>I can provide</th>
                        <th>...then I should use:</th>
                    </tr>
                </thead>
                <tbody>
                    {APP_DATA.entries.map(e => (
                        <TableRow key={JSON.stringify(e)} entry={e} />
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
