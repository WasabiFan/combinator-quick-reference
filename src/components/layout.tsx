import React from "react";
import PropTypes from "prop-types";

import SEO from "./seo";

import "../../styles/normalize.css";
import "../../styles/skeleton.css";
import "../../styles/page.scss";

const Layout = ({ children }: { children: any }) => {
    return (
        <>
            <SEO />
            <div id="header-bg">
                <div className="section">
                    <div className="container">
                        <div className="row">
                        <h1>
                            <code>Result</code> and <code>Option</code>{" "}
                            combinator quick-reference
                        {/* <a className="u-pull-right github-icon"></a> */}
                        <img src="/static/GitHub-Mark-Light-64px.png" />
                        </h1>
                        </div>
                    </div>
                </div>
            </div>
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
