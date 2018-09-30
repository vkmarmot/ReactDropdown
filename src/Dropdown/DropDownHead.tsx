import * as React from "react";

interface Props {
    children: React.ReactNode;
    noIcon?: boolean;
    title?: string;
    style?: React.CSSProperties;

    onClick?(children: React.ReactNode): void;
}

class DropDownHead extends React.Component<Props> {
    public static defaultProps = {
        noIcon: false,
        onClick: () => false,
        style: {},
        title: "",
    };

    public render() {
        const { noIcon, title, children, style } = this.props;

        return (
            <div
                onClick={this.handleClick}
                title={title}
                className="html-select-view-title-container"
            >
                <span className="html-select-view-title">
                    <span style={style}>
                        {children}
                    </span>
                </span>
                {(!noIcon && (<span className="html-select-view-selector" />)) || undefined}
            </div>
        );
    }

    private handleClick = (e: React.MouseEvent) => {
        if (this.props.onClick) {
            this.props.onClick({ value: this.props.children });
        }
        e.preventDefault();
        e.stopPropagation();
    }
}

export default DropDownHead;
