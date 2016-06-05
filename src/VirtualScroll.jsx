import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';

import MapLike from 'map-like';
import VirtualScrollCore from 'virtual-scroll-core';
import debounce from './debounce';

const identity = x => x;

const getInitialState = () => ({
    contentHeight: 0,
    offsetTop: 0,
    items: [],
});

/**
 * @public
 * @name VirtualScroll
 * This component allows you to display a large list, with reusing item's component.
 */
export default class VirtualScroll extends Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        rowRenderer: PropTypes.func.isRequired,
        wrapperComponent: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.object,
            PropTypes.string,
        ]),
        wrapperProps: PropTypes.object,

        // for VirtualScrollCore
        assumedHeight: PropTypes.number.isRequired,
        heightCache: PropTypes.object,
        viewport: PropTypes.object,
        items: PropTypes.array.isRequired,
        itemToCacheKey: PropTypes.func,
        bufferSize: PropTypes.number,
    }

    static defaultProps = {
        wrapperComponent: 'div',
        wrapperProps: {},

        // for VirtualScrollCore
        items: [],
        heightCache: new MapLike(),
        viewport: window,
        itemToCacheKey: identity,
        bufferSize: 0,
    }

    constructor(props, context) {
        super(props, context);
        this.state = getInitialState();

        this.updateHeight = this.updateHeight.bind(this);

        this.handleResize = this.handleResize.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    initialize(props) {
        this.virtualScrollState = new VirtualScrollCore(
            props.viewport,
            findDOMNode(this),
            props
        );
        this.resetStateDebounce = debounce(this.virtualScrollState.reset);
    }

    // events
    handleResize() {
        this.resetStateDebounce.enqueue();
        this.updateDebounce.enqueue();
    }

    handleScroll(evt) {
        this.updateDebounce.enqueue();
    }

    addListeners(props) {
        props.viewport.addEventListener('scroll', this.handleScroll);

        if (props.viewport === window) {
            props.viewport.addEventListener('resize', this.handleResize);
        }
    }

    removeListeners(props) {
        props.viewport.addEventListener('scroll', this.handleScroll);
        props.viewport.removeEventListener('resize', this.handleResize);
    }

    // update height cache
    // bound function
    updateHeight(item, height) {
        const updateSuccessed = this.virtualScrollState.updateCache(item, height);
        if(updateSuccessed) {
            this.updateDebounce.enqueue();
        }
    }

    update() {
        this.setState(this.virtualScrollState.update());
    }

    // lifecycle methods
    componentWillMount() {
        this.updateDebounce = debounce(this.update.bind(this));
    }

    componentDidMount() {
        this.initialize(this.props);
        this.addListeners(this.props);
        this.update();
    }

    componentWillReceiveProps(nextProps) {
        this.initialize(nextProps);
        this.removeListeners(nextProps);
        this.addListeners(nextProps);
        this.update();
    }

    componentWillUnmount() {
        this.removeListeners(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.items !== nextProps.items) {
            return true;
        }

        if (this.state.contentHeight !== nextState.contentHeight) {
            return true;
        }

        if (this.state.items.length !== nextState.items.length) {
            return true;
        }

        if (this.state.topOffset !== nextState.topOffset) {
            return true;
        }

        if (this.state.beginIdx !== nextState.beginIdx) {
            return true;
        }

        if (this.state.endIdx !== nextState.endIdx) {
            return true;
        }

        return false;
    }

    // rendering
    renderItems() {
        return this.state.items.map((item, index) => {
            return this.props.rowRenderer(item, this.state.firstIdx + index, this.props, this.state, this.updateHeight);
        });
    }

    render() {
        const css = {
            boxSizing: 'border-box',
            height: this.state.contentHeight + 'px',
            paddingTop: this.state.offsetTop + 'px',
        };

        return (
            <this.props.wrapperComponent
                className={this.props.className}
                id={this.props.id}
                {...this.props.wrapperProps}
                style={ css }
            >
                { this.renderItems() }
            </this.props.wrapperComponent>
        );
    }

    // Delegate functions.

    /**
     * Get offset of item specified by index.
     * @param {number} index - an item's index.
     * @return {number} offset - the item's offset in px. 
     */
    getOffsetByIndex(index) {
        return this.virtualScrollState.getOffsetByIndex(index);
    }

    /**
     * Get cached height of item specified by index. Default value is 'assumedHeight'.
     * @param {number} index - an item's index.
     * @return {number} height - the item's height in px.
     */
    getHeightByIndex(index) {
        return this.virtualScrollState.getHeightByIndex(index);
    }

    /**
     * @param {number} offset - target offset.
     * @return {number} index - of item which has greatest offset in less than or equal to given offset.
     */
    getIndexByOffset(offset) {
        return this.virtualScrollState.getIndexByOffset(offset);
    }

    /**
     * @return {number} contentHeight
     */
    getContentHeight() {
        return this.virtualScrollState.getContentHeight();
    }
    
    /**
     * @return {number} offsetTop - offset of items container
     */
    getOffsetTop() {
        return this.virtualScrollState.getOffsetTop();
    }

    /**
     * @return {number} visibleFirstIdx - index of visible first sliced item
     */
    getVisibleFirstIndex() {
        return this.virtualScrollState.getVisibleFirstIndex();
    }

    /**
     * @return {number} visibleLastIdx - index of visible last sliced item
     */
    getVisibleLastIndex() {
        return this.virtualScrollState.getVisibleLastIndex();
    }

    /**
     * @return {number} firstIdx - index of first sliced item
     */
    getFirstIndex() {
        return this.virtualScrollState.getFirstIndex();
    }

    /**
     * @return {number} lastIdx - index of last sliced item
     */
    getLastIndex() {
        return this.virtualScrollState.getLastIndex();
    }

    /**
     * @return {Array<*>} items
     */
    getItems() {
        return this.virtualScrollState.getItems();
    }

    /**
     * @public
     * @return {number} length of items
     */
    getItemsLength() {
        return this.virtualScrollState.getItemsLength();
    }

    /**
     * @public
     * @return {number} last index of items
     */
    getItemsLastIndex() {
        return this.virtualScrollState.getItemsLastIndex();
    }

    /**
     * @return {number} visibleHeight - clientHeight in container element
     */
    getVisibleHeight() {
        return this.virtualScrollState.getVisibleHeight();
    }

    /**
     * @return {number} offsetTop - offset of items container
     */
    getScrollTop() {
        return this.virtualScrollState.getScrollTop();
    }
}
