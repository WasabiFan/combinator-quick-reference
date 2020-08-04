import React from "react";
import COMBINATORS_DATA from "../../content/combinators.yaml";

import Layout from '../components/layout'

export default function Home() {
    return <Layout>
        <div>Data: {JSON.stringify(COMBINATORS_DATA)}</div>
    </Layout>;
}
