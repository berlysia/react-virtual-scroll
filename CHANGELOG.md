<a name="0.1.0"></a>
# [0.1.0](https://github.com/berlysia/react-virtual-scroll/compare/5ac167d...v0.1.0) (2016-06-05)


### Features

* **core:** Implement all delegate functions.([5ac167d](https://github.com/berlysia/react-virtual-scroll/commit/5ac167d))
* **rowRenderer:** Add index to arguments.([a756938](https://github.com/berlysia/react-virtual-scroll/commit/a756938))


### BREAKING CHANGES

* rowRenderer: rowRenderer's arguments are modified.
Added `index` into 2nd argument.
(item: any, **index: number,** vsProps: Props, vsState: State, reportHeight: (item: any, height: number) => JSX.Element)



