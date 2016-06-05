const React = require('react');
const render = require('react-dom').render;
const App = require('./app');

render(React.createElement(App), document.querySelector('#root'));
