import React from 'react';
import ReactDOM from 'react-dom';
import AppleCarousel from './AppleCarousel/test';

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(<AppleCarousel />, document.getElementById("root"));