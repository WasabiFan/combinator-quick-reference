import "../../styles/types.scss";
import React from "react";
import { commaJoin } from "../utils/jsx_utils";

export interface HighlightedTypeProps {
    type: string;
}

interface HighlightedTypePartProps {
    typeNode: TypeNode;
}

type TypeNode =
    | BareIdentifierTypeNode
    | GenericIdentifierTypeNode
    | TypeParameterTypeNode
    | FnTypeNode
    | ReferenceTypeNode;

interface BareIdentifierTypeNode {
    nodeType: "bare_identifier";
    name: string;
}

interface GenericIdentifierTypeNode {
    nodeType: "generic_identifier";
    name: string;
    generics: TypeNode[];
}

interface TypeParameterTypeNode {
    nodeType: "type_parameter_spec";
    name: BareIdentifierTypeNode;
    value: TypeNode;
}

interface FnTypeNode {
    nodeType: "fn_type";
    parameterType?: TypeNode;
    returnType: TypeNode;
}

interface ReferenceTypeNode {
    nodeType: "reference";
    target: TypeNode;
}

const ANCHORED_IDENTIFIER_WITH_GENERICS_REGEX = /^([a-zA-Z]+)(?:<(?:((?:[^<>]|<.*>)*),)*(.*)>)?$/;
function tryParseIdentifier(
    type: string
): BareIdentifierTypeNode | GenericIdentifierTypeNode | null {
    const match = ANCHORED_IDENTIFIER_WITH_GENERICS_REGEX.exec(type) ?? [];
    const [, ...groups] = [...match];

    if (groups.length < 1) {
        return null;
    }

    const name = groups[0].trim();
    const generics = groups
        .slice(1)
        .filter(str => str != undefined)
        .map(str => parseType(str.trim()));

    if (generics.length) {
        return {
            nodeType: "generic_identifier",
            generics,
            name,
        };
    } else {
        return {
            nodeType: "bare_identifier",
            name,
        };
    }
}

const ANCHORED_TYPE_PARAMETER_REGEX = /^([a-zA-Z]+):\s*(.*)$/;
function tryParseTypeParameter(type: string): TypeParameterTypeNode | null {
    const match = ANCHORED_TYPE_PARAMETER_REGEX.exec(type) ?? [];
    const [, nameStr, valueStr] = [...match];

    if (!nameStr || !valueStr) {
        return null;
    }

    const name = tryParseIdentifier(nameStr);
    if (!name || name.nodeType != "bare_identifier") {
        return null;
    }

    return {
        nodeType: "type_parameter_spec",
        name,
        value: parseType(valueStr),
    };
}

const ANCHORED_FUNCTION_REGEX = /^Fn\((.*)\)\s*->\s*(.*)$/;
function tryParseFunction(type: string): FnTypeNode | null {
    const match = ANCHORED_FUNCTION_REGEX.exec(type) ?? [];
    const [, paramStr, returnValueStr] = [...match];

    if (!match || !returnValueStr) {
        return null;
    }

    return {
        nodeType: "fn_type",
        returnType: parseType(returnValueStr),
        parameterType: paramStr.trim() ? parseType(paramStr.trim()) : undefined,
    };
}

const ANCHORED_REFERENCE_REGEX = /^&\s*(.*)$/;
function tryParseReference(type: string): ReferenceTypeNode | null {
    const match = ANCHORED_REFERENCE_REGEX.exec(type) ?? [];
    const [, targetStr] = [...match];

    if (!match || !targetStr) {
        return null;
    }

    return {
        nodeType: "reference",
        target: parseType(targetStr),
    };
}

function parseType(type: string): TypeNode {
    const typeParamResult = tryParseTypeParameter(type);
    if (typeParamResult) {
        return typeParamResult;
    }

    const identifierResult = tryParseIdentifier(type);
    if (identifierResult) {
        return identifierResult;
    }

    const referenceResult = tryParseReference(type);
    if (referenceResult) {
        return referenceResult;
    }

    const functionResult = tryParseFunction(type);
    if (functionResult) {
        return functionResult;
    }

    throw new Error(`Error parsing type fragment: "${type}"`);
}

function HighlightedTypePart({
    typeNode,
}: HighlightedTypePartProps): JSX.Element {
    if (typeNode.nodeType == "generic_identifier") {
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
    } else if (typeNode.nodeType == "bare_identifier") {
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
    } else if (typeNode.nodeType == "type_parameter_spec") {
        return (
            <>
                <HighlightedTypePart typeNode={typeNode.name} />:{" "}
                <HighlightedTypePart typeNode={typeNode.value} />
            </>
        );
    } else if (typeNode.nodeType == "fn_type") {
        return (
            <>
                Fn(
                {typeNode.parameterType && (
                    <HighlightedTypePart typeNode={typeNode.parameterType} />
                )}
                ) {"->"} <HighlightedTypePart typeNode={typeNode.returnType} />
            </>
        );
    } else if (typeNode.nodeType == "reference") {
        return (
            <>
                {"&"}
                <HighlightedTypePart typeNode={typeNode.target} />
            </>
        );
    } else {
        throw new Error();
    }
}

export default function HighlightedType({
    type,
}: HighlightedTypeProps): JSX.Element {
    return <HighlightedTypePart typeNode={parseType(type)} />;
}
