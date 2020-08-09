import '../../styles/types.scss';
import React from "react";
import { commaJoin } from '../utils/jsx_utils';

export interface HighlightedTypeProps {
    type: string;
}

interface HighlightedTypePartProps {
    typeNode: TypeNode;
}

type TypeNode = BareIdentifierTypeNode | GenericIdentifierTypeNode;

interface BareIdentifierTypeNode {
    type: "bare_identifier",
    name: string;
}

interface GenericIdentifierTypeNode {
    type: "generic_identifier",
    name: string;
    generics: TypeNode[];
}

const ANCHORED_IDENTIFIER_WITH_GENERICS_REGEX = /^([a-zA-Z]+)(?:<(?:((?:[^<>]|<.*>)*),)*(.*)>)?/;
function parseType(type: string): TypeNode {
    const match = ANCHORED_IDENTIFIER_WITH_GENERICS_REGEX.exec(type) ?? [];
    const [, ...groups] = [...match];

    if (groups.length < 1) {
        throw new Error("Parse error");
    }

    const name = groups[0].trim();
    const generics = groups
        .slice(1)
        .filter(str => str != undefined)
        .map(str => parseType(str.trim()));

    if (generics.length) {
        return {
            type: 'generic_identifier',
            generics,
            name
        }
    } else {
        return {
            type: 'bare_identifier',
            name
        }
    }
}

function HighlightedTypePart({
    typeNode,
}: HighlightedTypePartProps): JSX.Element {
    if (typeNode.type == "generic_identifier") {
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

export default function HighlightedType({ type }: HighlightedTypeProps): JSX.Element {
    return <HighlightedTypePart typeNode={parseType(type)} />;
}