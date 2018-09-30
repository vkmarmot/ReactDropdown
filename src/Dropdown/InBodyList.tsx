import * as cx from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

interface Props {
    maxHeight?: number;
    maxWidth?: number;
    width?: number;
    children?: React.ReactNode;
    className?: string;
    autoWidth?: boolean;
    rect?: {
        top: number;
        width: number;
        left: number;
    };
}

interface State {
    maxHeight: number;
    maxWidth: number;
    hasScroll: boolean;
}

export class InBodyList extends React.Component<Props, State> {
    public state: State = {
        hasScroll: false,
        maxHeight: 0,
        maxWidth: 0,
    };

    constructor(props: Props) {
        super(props);
        const clRect = document.body.getBoundingClientRect();
        const maxH = clRect.height * 0.5;
        this.state = {
            hasScroll: false,
            maxHeight: maxH,
            maxWidth: Math.min(300, clRect.width * 0.5),
        };
    }
    public componentDidMount() {
        this.updateHeight();
    }
    public render() {
        const {
            maxHeight, width, children, rect, className, autoWidth,
        } = this.props;
        const { hasScroll } = this.state;
        if (!rect) {
            return;
        }
        const style: {
            left: number,
            maxHeight: string,
            maxWidth: number | undefined,
            minWidth: number | undefined,
            top: number,
            width: number | undefined,
        } = {
            left: rect.left,
            maxHeight: (maxHeight || this.state.maxHeight) + "px",
            maxWidth: undefined,
            minWidth: undefined,
            top: rect.top,
            width,
        };
        if (!width && autoWidth) {
            style.maxWidth = rect.width;
            style.minWidth = rect.width;
        }
        return <ul style={style} className={cx(
            "dropdown-list-in-body",
            className,
            {"has-scroll": hasScroll},
            "html-select-view toggle")
        }>
            {children}
        </ul>;
    }

    private updateHeight() {
        const node = ReactDOM.findDOMNode(this) as Element;
        if (node) {
            let childHeight = 0;
            const bodyRect = document.body.getBoundingClientRect();
            const clRect = this.props.rect;
            if (clRect) {
                const newHeight = (bodyRect.bottom - 40) - clRect.top;
                if (this.props.maxHeight !== newHeight) {
                    for (let i = 0; i < node.childNodes.length; i++) {
                        const child = node.childNodes[i];
                        childHeight += (child as Element).getBoundingClientRect().height;
                    }
                    this.setState({
                        hasScroll: childHeight > newHeight,
                        maxHeight: newHeight,
                    });
                }
            }
        }
    }
}
