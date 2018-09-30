import { delayedFunction } from "map/utils/FunctionUtil";
import * as React from "react";
import DropDownContainer from "./DropdownContainer";
import DropDownList from "./DropdownList";

interface Props {
    opened?: boolean;
    noValue?: boolean;
    maxHeight?: number;
    head?: React.ReactElement<any>;
    blankValue?: React.ReactNode;
    className?: string;
    width?: number;

    onCollapse(collapse: boolean): void;
}


class DropDownBase extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        blankValue: null,
        className: "",
        head: undefined,
        maxHeight: undefined,
        noValue: false,
        opened: true,
        width: undefined,
    };

    private lastCollapsed: boolean = false;

    constructor(props: Props) {
        super(props);
        this.closeMenu = delayedFunction(this.closeMenu, 50);
    }

    public componentWillUnmount() {
        this.lastCollapsed = false;
        document.body.removeEventListener("click", this.closeMenu);
    }

    public render() {
        this.bindEventsToBodyIfNeed();
        const { opened } = this.props;

        return (
            <DropDownContainer
                opened={opened}
                className={this.props.className}
            >
                {this.renderDropdownList()}
            </DropDownContainer>
        );
    }

    private renderDropdownList(): React.ReactNode[] {
        const { opened, children } = this.props;

        const childs = this.props.head ? [this.props.head] : [];
        const childrenArray = React.Children.toArray(children);
        if (opened && (childrenArray.length || this.props.blankValue)) {
            childs.push(
                <DropDownList
                    key="list"
                    maxHeight={this.props.maxHeight}
                    className={this.props.className}
                    autoWidth={!this.props.noValue}
                    width={this.props.width}
                >
                    {childrenArray.length ? this.props.children : <li>{this.props.blankValue}</li>}
                </DropDownList>,
            );
        }
        return childs;
    }

    private readonly closeMenu = () => {
        if (this.props.onCollapse) {
            this.props.onCollapse(true);
        }
    }

    private readonly bindEventsToBodyIfNeed = () => {
        if (this.lastCollapsed && this.props.opened) {
            document.body.addEventListener("click", this.closeMenu);
        }
        if (!this.lastCollapsed && !this.props.opened) {
            document.body.removeEventListener("click", this.closeMenu);
        }
        this.lastCollapsed = !this.props.opened;
    }
}
export default DropDownBase;
