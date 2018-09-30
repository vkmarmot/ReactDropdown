import DOM from 'react-dom-factories';
import createClass from 'create-react-class';
import React from 'react';

import DropDownWidget from './DropdownWidget';
import Button from '../../WidgetButtonSquare';

const ButtonDropDown = createClass({
    displayName: 'ButtonDropDown',
    headerButtonClickHandler: function (e) {
        if (this.props.onClick) {
            this.props.onClick({value: e.value});
        }
    },
    render: function () {
        var cx = require('classnames'),
            head = React.createElement(
            DropDownHead,
            {
                disabled: this.props.disabled,
                id: this.props.id,
                key: 'head',
                title: this.props.title,
                active: this.props.active,
                onButtonClick: this.headerButtonClickHandler
            },
            this.props.value
        );
        var className = cx('button-dropdown widget' ,this.props.className);
        return React.createElement(DropDownWidget, {
            active: this.props.active,
            title: this.props.title,
            value: this.props.value,
            noValue: true,
            head: head,
            className: className
        }, this.props.children);
    }
});

var DropDownHead = createClass({
    handleClick: function (e) {
        if (this.props.onClick) {
            this.props.onClick({value: this.props.children});
        }
        e.preventDefault();
        e.stopPropagation();
    },
    handleButtonClick: function (e) {
        if (this.props.onButtonClick) {
            this.props.onButtonClick({value: this.props.children});
        }
    },
    render: function () {
        var childs = [React.createElement(
            Button,
            {active: this.props.active, id: this.props.id},
            DOM.span({className:"html-select-view-selector"})
        )];
        if (!this.props.noIcon) {
            childs.push(DOM.span({className: 'html-select-view-selector'}));
        }
        return (DOM.div(
            {className: 'button-dropdown-container'},
            [
                React.createElement(Button, {
                    key: 'bt',
                    disabled: this.props.disabled,
                    title: this.props.title,
                    onClick: this.handleButtonClick,
                    active: this.props.active,
                    id: this.props.id
                }),
                DOM.span({key: 'sp', onClick: this.handleClick, className:"html-select-view-selector "})
            ]
        ));
    }
});
module.exports = ButtonDropDown;
