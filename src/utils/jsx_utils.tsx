import React from "react";

export function elementJoin(elements: JSX.Element[], separatorElem: JSX.Element = <>, </>): JSX.Element | null {
    return elements.reduce<JSX.Element | null>(
        (acc, x) =>
            acc === null ? (
                x
            ) : (
                <>
                    {acc}{separatorElem}{x}
                </>
            ),
        null
    );
}
