import * as React from "react";
import * as ReactDOM from "react-dom";

import { InBodyList } from "./InBodyList";


interface DropdownListProps {
    autoWidth?: boolean;
    className?: string;
    children?: React.ReactNode;
    maxHeight?: number;
    width?: number;
}

class DropDownList extends React.Component<DropdownListProps> {
    private readonly div: HTMLDivElement;
    constructor(props: DropdownListProps) {
        super(props);
        this.div = document.createElement("div");
    }
    public componentDidMount() {
        document.body.appendChild(this.div);
        this.renderList();
    }
    public componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.div);
        document.body.removeChild(this.div);
    }

    public componentDidUpdate() {
        this.renderList();
    }
    public renderList() {
        const domNode: Element = ReactDOM.findDOMNode(this) as Element;
        if (domNode) {
            const rect = domNode.getBoundingClientRect();
            const { maxHeight, children, className, autoWidth, width } = this.props;
            ReactDOM.render(
        <InBodyList
                    width={width}
                    autoWidth={autoWidth}
                    className={className}
                    maxHeight={maxHeight}
                    rect={rect}
                >
                    {children}
                </InBodyList>,
                this.div);
        }
    }
    public render() {
        return <div/>;
    }
}

export default DropDownList;
