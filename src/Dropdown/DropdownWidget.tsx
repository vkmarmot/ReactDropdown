import * as React from "react";
import DropDownBase from "./DropDown.Base";
import DropDownHead from "./DropDownHead";


const filterListElement = (ch: React.ReactChild) => (ch as React.ReactElement<any>).props
    && (ch as React.ReactElement<any>).props.selected;

interface State {
    collapsed: boolean;
}

interface Props {
    opened?: boolean;
    value?: string;
    children?: React.ReactNode;
    width?: number;
    maxHeight?: number;
    title?: string;
    head?: React.ReactElement<any>;
    noValue?: boolean;
    disabled?: boolean;
    blankValue?: React.ReactNode;
    className?: string;

    onCollapse?(collapsed: boolean): void;
}

class DropDownWidget extends React.Component<Props, State> {
    public static defaultProps = {
        blankValue: null,
        children: undefined,
        className: "",
        disabled: false,
        head: null,
        maxHeight: undefined,
        noValue: false,
        opened: false,
        title: "",
        value: undefined,
        width: undefined,

        onCollapse: () => false,
    };

    public state = {
        collapsed: true,
    };

    public componentWillReceiveProps(newProps: Props) {
        if (this.props.opened && newProps.opened === false) {
            this.setState({
                collapsed: true,
            }, this.handleCollapsedChanged);
        }
    }

    public render() {
        const {
            blankValue,
            className,
            maxHeight,
            title,
            disabled,
            width,
            head,
            opened,
            children,
        } = this.props;
        const { collapsed } = this.state;

        const headElement = head ?
            React.cloneElement(head, {
                key: "head",
                onClick: !disabled && this.headerClickHandler,
            }) :
            (<DropDownHead
                key="head"
                title={title}
                onClick={(!disabled && this.headerClickHandler) || undefined}
            >
                {this.getHeadContentFromList()}
            </DropDownHead>);
        return (
            <DropDownBase
                blankValue={blankValue}
                className={className}
                head={headElement}
                maxHeight={maxHeight}
                onCollapse={this.handleCollapse}
                opened={opened || !collapsed}
                width={width}
            >
                {children}
            </DropDownBase>
        );
    }

    private getHeadContentFromList(): React.ReactNode {
        const {
            value,
            children,
        } = this.props;
        let headContent = value;
        const childrenArray = React.Children.toArray(children);
        if (!headContent && childrenArray.length) {
            const selected = childrenArray.filter(filterListElement);
            headContent = selected[0] ? (selected[0] as React.ReactElement<any>).props.children : "";
        }
        return headContent;
    }

    private handleCollapsedChanged = () => {
        if (this.props.onCollapse) {
            this.props.onCollapse(this.state.collapsed);
        }
    }
    private headerClickHandler = () => {
        // console.log('headerClickHandler');
        this.setState({ collapsed: !this.state.collapsed }, this.handleCollapsedChanged);
    }
    private handleCollapse = (collapsed: boolean) => {
        // console.log('handleCollapse');
        this.setState({
            collapsed,
        }, this.handleCollapsedChanged);
    }
}
export default DropDownWidget;
