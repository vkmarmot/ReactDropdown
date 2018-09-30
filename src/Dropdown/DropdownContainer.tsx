import * as cx from "classnames";
import * as React from "react";

interface Props {
    children?: React.ReactNode;
    className?: string;
    opened?: boolean;
}

const DropDownContainer: React.StatelessComponent<Props> = (props: Props) => {
    const { opened, children, className } = props;

    const literal = {
        closed: !opened,
    };

    return (
        <div
            className={cx(literal, "html-select-view-container" , className)}
        >
            {children}
        </div>
    );
};

DropDownContainer.defaultProps = {
    children: undefined,
    className: "",
    opened: true,
};

export default DropDownContainer;
