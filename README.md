# react-virtual-scroll

height cacheable virtual scroll for react

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @berlysia/react-virtual-scroll

## API

### Props
- id - string
    - *Optional*.
- className - string
    - *Optional*.
- rowRenderer - (item: any, index: number, vsProps: Props, vsState: State, reportHeight: (item: any, height: number) => JSX.Element)
    - **Required**.
    - `index` is the `item`'s index in original array.
    - `reportHeight`'s reference identity is ensured.
    - `vsProps` is this component's props object.
    - `vsState` is this component's state object.
- wrapperComponent: ReactComponent or string
    - *Optional*. Default is "div".
- wrapperProps: any
    - *Optional*. Default is {}.
- assumedHeight - number
    - **Required**.
    - For items which have unknown height.
- heightCache - MapLike
    - *Optional*.
    - Default is some MapLike object. 
    - ES2015 Map is enough for this props.
    - MapLike is...
        ```
        interface MapLike {
            has(key: any): boolean;
            get(key: any): any;
            set(key: any, val: any;
        }
        ```
- viewport - HTMLElement or window
    - *Optional*. Default is `window`.
- items - Array<*>
    - **Required**.
- itemToCacheKey - (item: any) => any(optional, default = x => x)
    - *Optional*.
- bufferSize - number
    - *Optional*.
    

## Running tests

Install devDependencies and Run `npm test`.
or simply:

    npm -d it

## Contributing

Pull requests and stars are always welcome.
For bugs and feature requests, [please create an issue](https://github.com/berlysia/react-virtual-scroll/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

Copyright © 2016-present berlysia.
Licensed under the MIT license.