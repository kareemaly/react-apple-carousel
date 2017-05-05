react-apple-carousel
---------------

Installing
------------
```
$ npm install react-apple-carousel --save
```

[Demos](http://bitriddler.com/playground/apple-carousel)
--------------

Usage
--------

```javascript
<AppleCarousel
  renderSlides={[
    ({ activeItemIndex, index }) => <Slide1 isActive={index === activeItemIndex} />,
    ({ slide }) => <Slide2 animationValue={slide} />,
    () => <Slide3 />,
    () => <Slide4 />,
  ]}
/>
```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| renderSlides* | arrayOf (func) |  | Array of functions that gets called with the following object to help<br />you build a prallax animation.<br /><br />`index: Integer` Index of the slide<br />`slide: Number` Number between 0 and slides.length. use this to make the parallax animation.<br />`activeItemIndex: Integer` The current active item index<br />`containerWidth: Number` The container width |
| springConfig | shape {<br />`stiffness: number`<br />`damping: number`<br />} | presets.noWobble | React motion configurations.<br />[More about this here](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig) |
| breakPointRatio | number | 0.5 | Number between 0 and 1 used to see if the slide should be turned or not.<br />For example setting this at 0.1 will switch the slide with the slightest<br />user move. |
| activeItemIndex | number | 0 | Use this to set the active item index at mount. |
| onActiveItemChange | func |  | Called when the active item change passing the item index |
| indicatorsBottom | number | 30 | Indicators bottom absolute position. |
| enableTimer | bool | true | Whether or not to enable timer. |
| timerInterval | number | 3000 | Only available if `enableTimer` is true. |
| enableIndicators | bool | true | If true we will render default indicators that matches apple design. |

Contributing
--------------
To contribute, follow these steps:
- Fork this repo.
- Clone your fork.
- Run `npm install`
- Run `npm start`
- Goto `localhost:3000`
- Add your patch then push to your fork and submit a pull request

License
---------
MIT
