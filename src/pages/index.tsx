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

export default function Home() {
    return (
        <Layout>
            <div>Data: {JSON.stringify(APP_DATA)}</div>
        </Layout>
    );
}
