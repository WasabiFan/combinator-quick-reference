import React from "react";
// @ts-ignore
import COMBINATORS_DATA_IMPORT from "../../content/combinators.yaml";

import Layout from '../components/layout'

interface Given {
    type: string,
    desc: string
}

interface CombinatorData {
    have: string,
    want: string,
    panics?: boolean,
    candidates: string | string[],
    given: Given[],
}

const COMBINATORS_DATA: CombinatorData[] = COMBINATORS_DATA_IMPORT;

export default function Home() {
    return <Layout>
        <div>Data: {JSON.stringify(COMBINATORS_DATA)}</div>
    </Layout>;
}
