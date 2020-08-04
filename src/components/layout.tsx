import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

// import Header from "./header"
import SEO from "./seo";

import "../../styles/normalize.css";
import "../../styles/skeleton.css";

const Layout = ({ children }: { children: any }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    return (
        <>
            <SEO />
            {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
            <div className="section">
                <div className="container">
                    <main>{children}</main>
                </div>
            </div>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
