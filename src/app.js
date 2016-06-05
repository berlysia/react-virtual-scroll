const React = require('react');
const findDOMNode = require('react-dom').findDOMNode;
const EventEmitter = require('events').EventEmitter;
const LoremIpsum = require('lorem-ipsum');
const VirtualScroll = require('@berlysia/react-virtual-scroll');

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.update = this.update.bind(this);
    }

    update() {
        const state = {
            itemsSize: parseInt(findDOMNode(this.itemsSizeEl).value, 10),
            assumedHeight: parseInt(findDOMNode(this.assumedHeightEl).value, 10),
            bufferSize: parseInt(findDOMNode(this.bufferSizeEl).value, 10),
            wrapperId: findDOMNode(this.wrapperIdEl).value,
            wrapperClassName: findDOMNode(this.wrapperClassNameEl).value,
            wrapperComponent: findDOMNode(this.wrapperComponentEl).value,
        }
        this.props.update(state);
    }

    render() {
        return (
            <div role='form'>
                <label>itemsSize</label>
                <input type="number" name="itemsSize" value={this.props.itemsSize} ref={x => this.itemsSizeEl = x} onChange={this.update}/>
                <label>assumedHeight</label>
                <input type="number" name="assumedHeight" value={this.props.assumedHeight} ref={x => this.assumedHeightEl = x} onChange={this.update}/>
                <label>bufferSize</label>
                <input type="number" name="bufferSize" value={this.props.bufferSize} ref={x => this.bufferSizeEl = x} onChange={this.update}/>
                <label>wrapperId</label>
                <input type="text" name="wrapperId" value={this.props.wrapperId} ref={x => this.wrapperIdEl = x} onChange={this.update}/>
                <label>wrapperClassName</label>
                <input type="text" name="wrapperClassName" value={this.props.wrapperClassName} ref={x => this.wrapperClassNameEl = x} onChange={this.update}/>
                <label>wrapperComponent</label>
                <input type="text" name="wrapperComponent" value={this.props.wrapperComponent} ref={x => this.wrapperComponentEl = x} onChange={this.update}/>
            </div>
        );
    }
}

class RowComponent extends React.Component {
    reportHeight() {
        const height = findDOMNode(this).getBoundingClientRect().height;
        this.props.reportHeight(this.props.content, height)
    }
    componentDidMount() {
        this.reportHeight();  
    }
    componentDidUpdate() {
        this.reportHeight();
    }
    render() {
        return (<div className="item">{this.props.content}</div>);
    }
}

function rowRenderer(item, index, state, props, reportHeight) {
    return <RowComponent key={index} reportHeight={reportHeight} content={item} />;
}

function Example(props) {
    return (
        <VirtualScroll
            id={props.wrapperId}
            className={props.wrapperClassName}
            items={props.items}
            assumedHeight={props.assumedHeight}
            bufferSize={props.bufferSize}
            wrapperComponent={props.wrapperComponent}
            rowRenderer={rowRenderer}
        />
    );
}

module.exports = class App extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            itemsSize: 100,
            assumedHeight: 40,
            bufferSize: 0,
            wrapperId: 'virtual-scroll-id',
            wrapperClassName: 'virtual-scroll-class',
            wrapperComponent: 'div',
        };

        this.items = LoremIpsum({
            units: 'paragraphs',
            count: 100,
            paragraphLowerBound: 2,
            paragraphUpperBound: 7,
        }).split('\n\n').map((x,i)=>i+' '+x);

        this.update.bind(this);
    }

    update(nextState) {
        this.setState(nextState);
    }

    componentWillUpdate(nextProps, nextState) {
        const sizeDiff = nextState.itemsSize - this.state.itemsSize;
        if(sizeDiff > 0) {
            const currentSize = this.items.length;
            const append = LoremIpsum({
                units: 'paragraphs',
                count: sizeDiff,
                paragraphLowerBound: 2,
                paragraphUpperBound: 7,
            }).split('\n\n').map((x,i)=>(currentSize+i)+' '+x);;
            this.items = this.items.concat(append);
        } else if(sizeDiff < 0) {
            this.items = this.items.slice(0, nextState.itemsSize);
        }
    }

    render() {
        return (
            <div>
                <Header {...this.state} update={this.update.bind(this)} />
                <Example items={this.items} {...this.state} />
            </div>
        );
    }
}
