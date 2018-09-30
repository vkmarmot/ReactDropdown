import * as React from "react";

import DropDownList from "./DropdownWidget";

import { Input, InputChangeEvent } from "../Input";
import DropDownHead from "./DropDownHead";
import ListElement, { EventData } from "./ListElement";

const UP = 38;
const DOWN = 40;
const ENTER = 13;

export interface ListElementData {
    value: string;
    name: string;
}

interface AutocompleteProps {
    values: ListElementData[];
    value?: ListElementData;
    labelText?: string;
    placeholder?: string;
    selectedValue?: string;
    selected?: boolean;
    disabled?: boolean;
    filter?: boolean;

    onChange(value: string | undefined): void;
    onBlur?(value: string | undefined): void;
}

interface AutocompleteState {
    opened: boolean;
    selected: boolean;
    selectedValue: ListElementData | undefined | null;
}

const filter = (currentValue?: ListElementData) => ({ value }: ListElementData): boolean => {
    const currentListVal = (currentValue && currentValue.value.toLowerCase()) || "";
    return value.toLowerCase().indexOf(currentListVal) > -1;
};


class Autocomplete extends React.Component<AutocompleteProps, AutocompleteState> {
    public static defaultProps: Partial<AutocompleteProps> = {
        disabled: false,
        filter: true,
        labelText: undefined,
        placeholder: undefined,
        selected: false,
        selectedValue: undefined,
        value: undefined,
    };
    public state: AutocompleteState = {
        opened: false,
        selected: false,
        selectedValue: undefined,
    };

    private currentTimeout: number;

    public componentWillReceiveProps(): void {
        this.setState({
            selectedValue: null,
        });
    }
    public render() {
        const values = this.getValues();
        const { value, disabled } = this.props;
        return (
            <div className="gis-autocomplete">
                <DropDownList
                    disabled={disabled}
                    title={this.props.labelText}
                    opened={this.state.opened}
                    head={<DropDownHead>
                        <Input
                            disabled={disabled}
                            value={(value && value.value) || ""}
                            placeholder={this.props.placeholder}
                            onKeyUp={this.handleKeyUp}
                            onBlur={this.handleBlur}
                            onFocus={this.handleFocus}
                            onChange={this.handleChange}
                        />
                    </DropDownHead>}
                >
                    {values.map(this.renderListElement)}
                </DropDownList>
            </div>
        );
    }

    private renderListElement = (data: ListElementData): React.ReactElement<ListElement> => {
        const selectedValue = this.getValue();
        const value = (selectedValue && selectedValue.value) || undefined;
        return (
            <ListElement
                key={`element-${data.value}`}
                onClick={this.handleSelect}
                selected={value === data.value}
                value={data.value}
            >
                {data.name}
            </ListElement>
        );
    }
    private handleSelect = (e: EventData<string>): void => {
        this.setState({ opened: false });
        if (this.props.onChange) {
            this.props.onChange(e.value);
        }
    }
    private getValues(): ListElementData[] {
        if (this.props.filter) {
            return this.props.value && this.state.selected ?
                this.props.values.filter(filter(this.props.value)) : this.props.values;
        }

        return this.props.values;
    }
    private handleChange = (e: InputChangeEvent): void => {
        if (this.props.onChange) {
            this.setState({ opened: this.state.selected });
            this.props.onChange(e.text);
        }
    }
    private handleAfterBlur = (): void => {
        this.currentTimeout = 0;
        if (this.state.opened || this.state.selected) {
            this.setState({
                opened: false,
                selected: false,
            });
        }
    }
    private handleBlur = (e: InputChangeEvent): void => {
        if (this.props.onBlur) {
            this.props.onBlur(e.text);
        }
        if (!this.currentTimeout) {
            this.currentTimeout = setTimeout(this.handleAfterBlur, 200);
        }
    }
    private handleFocus = (): void => {
        clearTimeout(this.currentTimeout);
        if (!this.state.opened || !this.state.selected) {
            this.setState({
                opened: true,
                selected: true,
            });
        }
    }
    private collapse(): void {
        this.setState({
            opened: false,
        });
    }

    private moveTo(index: number) {
        const selectedValue = this.getValue();
        if (selectedValue) {
            this.setSelected(this.indexOf(selectedValue) + index);
        }
    }

    private indexOf({ value }: ListElementData): number {
        const values = this.getValues();
        for (let i = 0; i < values.length; i++) {
            const listValue = values[i];
            if (listValue.value === value) {
                return i;
            }
        }
        return -1;
    }

    private handleKeyUp = (e: React.KeyboardEvent): void => {
        // console.log(e.nativeEvent.keyCode);
        this.setState({
            opened: true,
        });
        switch (e.nativeEvent.keyCode) {
            case UP:
                this.moveTo(-1);
                break;
            case DOWN:
                this.moveTo(1);
                break;
            case ENTER:
                if (this.props.onChange) {
                    this.collapse();
                    const value = this.getValue();
                    this.props.onChange(value && value.value);
                }
                break;
        }
    }
    private setSelected(index: number): void {
        const values = this.getValues();
        const lower = index < values.length;
        if (!lower) {
            index = values.length - 1;
        }
        const bigger = index > 0;
        if (!bigger) {
            index = 0;
        }
        this.setState({
            selectedValue: values[index],
        }, this.handleMoveTo);
    }

    private handleMoveTo = () => {
        if (this.props.onChange) {
            const value = this.getValue();
            this.props.onChange(value && value.value);
        }
    }

    private getValue(): ListElementData | undefined {
        return this.state.selectedValue || this.props.value;
    }
}

export default Autocomplete;
