import React from "react";

export function commaJoin(elements: JSX.Element[]): JSX.Element | null {
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
