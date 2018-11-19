import React from "react";

export default class Layout extends React.Component {
    public render() {
        return (
            <div className="container">
                <div className="columns">
                    <div className="column">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
