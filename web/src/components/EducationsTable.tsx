import { Table } from "antd";
import React from "react";
import styled from "styled-components";

class EducationsTable extends React.Component {

    public render(): React.ReactNode {
        return (
            <H1 isPrimary={true}>Test</H1>
            // <Table />
        );
    }
}

const H1 = styled.h1<{ isPrimary: boolean }>((props) => {
    return {
        "backgroundColor": props.isPrimary ? "green" : "red",
        "color": "yellow",
        "&:hover": {
            backgroundColor: "purple",
        },
    };
});

export default EducationsTable;
