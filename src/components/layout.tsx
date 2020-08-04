import React from "react";
import PropTypes from "prop-types";

import SEO from "./seo";

import "../../styles/normalize.css";
import "../../styles/skeleton.css";

const Layout = ({ children }: { children: any }) => {
    return (
        <>
            <SEO />
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
