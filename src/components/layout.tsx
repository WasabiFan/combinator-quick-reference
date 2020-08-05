import React from "react";
import PropTypes from "prop-types";

import SEO from "./seo";

import "../../styles/normalize.css";
import "../../styles/skeleton.css";
import "../../styles/styles.scss";

const Layout = ({ children }: { children: any }) => {
    return (
        <>
            <SEO />
            <div id="header-bg">
                <div className="section">
                    <div className="container">
                        <h1>Result and Option quick-reference</h1>
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
