babel-plugin-named-asset-import 
[![Travis Build](https://img.shields.io/travis/FWeinb/babel-plugin-named-asset-import.svg?style=flat-square)](https://travis-ci.org/FWeinb/babel-plugin-named-asset-import)
[![Codecov](https://img.shields.io/codecov/c/github/FWeinb/babel-plugin-named-asset-import.svg?style=flat-square)](https://codecov.io/gh/FWeinb/babel-plugin-named-asset-import)
====

Proof of Concept for [facebookincubator/create-react-app#3722](https://github.com/facebookincubator/create-react-app/issues/3722) implemented as a bable-plugin. 

This will translate this:
```js
import { url as logoUrl } from './logo.png';
import { html as docHtml } from './doc.md';
import { ReactComponent as Icon } from './icon.svg';
```

into

```js
import logoUrl from 'url-loader!./logo.png';
import docHtml from 'html-loader!markdown-loader!./doc.md';
import Icon from 'svg-react-loader!./icon.svg';"
```

The webpack configuration of the various loaders is left to the user (e.g. create-react-app).

## Edge Cases

### Default Import 

For now default imports will be left as is, this allows the user to configure it's own "default" behaviour. 
`import Icon from './icon.svg';` will be left as is. 

### Request of an unkown asset

```js
import { someUnkownAsset } from './icon.svg' 
```

Will currently result in a compile type error like this: 

`SyntaxError: filename.js: Unkown asset requested, possible assets are: url, raw, ReactComponent`
