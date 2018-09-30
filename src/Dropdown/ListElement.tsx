import * as cx from "classnames";
import * as React from "react";

export interface EventData<T> {
    value: T;
}

interface Props<T> {
    value: T;

    className?: string;
    disabled?: boolean;
    selected?: boolean;

    onClick(data: EventData<T>): void;
}


class ListElement<T = string> extends React.Component<Props<T>> {
    public static defaultProps = {
        className: "",
        disabled: false,
        selected: false,
    };

    public render() {
        return (
            <li
                onClick={this.handleClick}
                className={this.getClassName()}
            >
                {this.props.children}
            </li>
        );
    }

    private handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
        if (this.props.onClick) {
            this.props.onClick({ value: this.props.value });
        }
        e.preventDefault();
        e.stopPropagation();
    }

    private getClassName() {
        const { selected, disabled, className } = this.props;
        const literal = {
            disabled,
            selected,
        };
        return cx(literal, "html-list-active html-select-view-row", className);
    }
}


export default ListElement;
