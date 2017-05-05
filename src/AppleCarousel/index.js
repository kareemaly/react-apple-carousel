import React from 'react';
import Measure from 'react-measure';
import PropTypes from 'prop-types';
import { presets, Motion, spring } from 'react-motion';
import styled from 'styled-components';
import { getPosition, getCurrentMillis } from './helpers';
import { calculateNextDistance } from './math';
import { stringifyTranslate, calculateSlidingAnimation } from './animation';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Slides = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Slide = styled.div`
  width: 100%;
  color: ${(props) => props.color};
  background: ${(props) => props.bgColor};
  flex-shrink: 0;
  ${(props) => stringifyTranslate(calculateSlidingAnimation(props))}
`;

const IndicatorsWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: ${(props) => props.indicatorsBottom}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorsInnerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  max-width: ${150 + 10 + 10}px;
`;

const IndicatorWrapper = styled.div`
  padding: 10px 0px;
  flex-grow: 1;
`;

const Indicator = styled.div`
  height: 2px;
  background: rgba(128,128,128,0.2);
  margin: 0px 5px;
`;

const InnerIndicator = styled.div`
  height: 2px;
  width: 0%;
  ${(props) => props.isActive && `width: ${props.animateIndicatorTo * 100}%;`}
  background: gray;
`;

export default class AppleCarousel extends React.Component {
  static propTypes = {
    /**
     * Array of functions that gets called with the following object to help
     * you build a prallax animation.
     * 
     * `index: Integer` Index of the slide
     * `slide: Number` Number between 0 and slides.length. use this to make the parallax animation.
     * `activeItemIndex: Integer` The current active item index
     * `containerWidth: Number` The container width
     */
    renderSlides: PropTypes.arrayOf(PropTypes.func).isRequired,
    /**
     * React motion configurations.
     * [More about this here](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig)
     */
    springConfig: PropTypes.shape({
      stiffness: PropTypes.number,
      damping: PropTypes.number,
    }),
    /**
     * Number between 0 and 1 used to see if the slide should be turned or not.
     * For example setting this at 0.1 will switch the slide with the slightest
     * user move.
     */
    breakPointRatio: PropTypes.number,
    /**
     * Use this to set the active item index at mount.
     */
    activeItemIndex: PropTypes.number,
    /**
     * Called when the active item change passing the item index
     */
    onActiveItemChange: PropTypes.func,
    /**
     * Indicators bottom absolute position.
     */
    indicatorsBottom: PropTypes.number,
    /**
     * Whether or not to enable timer.
     */
    enableTimer: PropTypes.bool,
    /**
     * Only available if `enableTimer` is true.
     */
    timerInterval: PropTypes.number,
    /**
     * If true we will render default indicators that matches apple design.
     */
    enableIndicators: PropTypes.bool,
  };

  static defaultProps = {
    springConfig: presets.noWobble,
    breakPointRatio: 0.5,
    activeItemIndex: 0,
    indicatorsBottom: 30,
    enableTimer: true,
    timerInterval: 3000,
    enableIndicators: true,
  };

  componentWillMount() {
    const { activeItemIndex } = this.props;

    this.setState({
      activeItemIndex: activeItemIndex,
      animateTo: activeItemIndex,
      containerWidth: 0,
      animateIndicatorTo: 0,
      lastTimerMillis: getCurrentMillis(),
    });
  }

  componentDidMount() {
    const { enableTimer, timerInterval, renderSlides } = this.props;

    if(enableTimer) {
      window.requestAnimationFrame(() => this.runTimer({
        timerInterval,
        noOfSlides: renderSlides.length,
      }));
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getTimerNextItem(activeItemIndex, noOfSlides) {
    if(activeItemIndex === noOfSlides - 1) {
      return 0;
    } else {
      return activeItemIndex + 1;
    }
  }

  getTimerRatio({ lastTimerMillis, timerInterval }) {
    // This value will be between 0 and 1
    return (getCurrentMillis() - lastTimerMillis) / timerInterval;
  }

  gotoTimerNextItem({ activeItemIndex, noOfSlides }) {
    this.setState({
      activeItemIndex: this.getTimerNextItem(activeItemIndex, noOfSlides),
      lastTimerMillis: getCurrentMillis(),
    });
  }

  runTimer = ({ timerInterval, noOfSlides }) => {
    if(this.unmounted) {
      return;
    }

    if(this.state.stopTimer) {
      this.setState({
        animateIndicatorTo: 1,
      });
      return;
    }

    const timerRatio = this.getTimerRatio({
      lastTimerMillis: this.state.lastTimerMillis,
      timerInterval,
    });

    // Timer finished, go to next active item
    if(timerRatio >= 1) {
      this.gotoTimerNextItem({
        noOfSlides,
        activeItemIndex: this.state.activeItemIndex,
      });
    //
    } else {
      this.setState({
        animateIndicatorTo: timerRatio,
      });
    }

    window.requestAnimationFrame(() => this.runTimer({ timerInterval, noOfSlides }));
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.activeItemIndex !== this.state.activeItemIndex) {
      nextProps.onActiveItemChange && nextProps.onActiveItemChange(nextState.activeItemIndex);
      this.animateTo(nextState.activeItemIndex);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.activeItemIndex !== this.state.activeItemIndex) {
      this.setState({
        activeItemIndex: nextProps.activeItemIndex,
      });
    }
  }

  animateTo(animateTo) {
    this.setState({ animateTo });
  }

  onIndicatorClick = (index) => {
    this.setState({
      activeItemIndex: index,
      stopTimer: true,
    });
  }

  swipeEnd = ({
    startPosX,
    breakPointRatio,
    activeItemIndex,
    noOfSlides,
    containerWidth,
    lastPosX,
    startDragMillis,
  }) => {
    if(!startPosX || !lastPosX) {
      return;
    }

    const deltaX = lastPosX - startPosX;
    const swippingLeft = deltaX < 0;
    const endDragMillis = getCurrentMillis();
    const resistanceCoeffiecent = 0.5;

    const nextDistance = calculateNextDistance({
      deltaX,
      startDragMillis,
      endDragMillis,
      resistanceCoeffiecent,
    });

    const nextPosX = nextDistance + lastPosX;
    const nextPosRatio = nextPosX / containerWidth;

    if(swippingLeft) {
      if(activeItemIndex < noOfSlides - 1 && nextPosRatio < breakPointRatio) {
        this.setState({
          activeItemIndex: activeItemIndex + 1,
        });
      } else {
        this.animateTo(activeItemIndex);
      }
    } else {
      if(activeItemIndex > 0 && nextPosRatio > breakPointRatio) {
        this.setState({
          activeItemIndex: activeItemIndex - 1,
        });
      } else {
        this.animateTo(activeItemIndex);
      }
    }
  }

  swipeMove = (e, {
    startPosX,
    activeItemIndex,
    containerWidth,
    noOfSlides,
  }) => {
    const { posX, posY } = getPosition(e);
    const posXRelativeToContainer = ((startPosX - posX) / containerWidth);
    const animateTo = activeItemIndex + posXRelativeToContainer;
    if(animateTo > 0 && animateTo < noOfSlides) {
      this.setState({
        lastPosX: posX,
        animateTo,
      });
    }
  }

  swipeStart = (e) => {
    const { posX } = getPosition(e);
    this.setState({
      stopTimer: true,
      startPosX: posX,
      startDragMillis: getCurrentMillis(),
    });
  }

  isIndicatorActive = ({
    index,
    activeItemIndex,
    slide,
    breakPointRatio,
  }) => {
    return (index - breakPointRatio) <= slide && (index + breakPointRatio) >= slide;
  }

  render() {
    const {
      springConfig,
      breakPointRatio,
      renderSlides,
      indicatorsBottom,
      enableIndicators,
    } = this.props;

    const {
      animateTo,
      activeItemIndex,
      containerWidth,
      startDragMillis,
      startPosX,
      lastPosX,
      animateIndicatorTo,
    } = this.state;

    const noOfSlides = renderSlides.length;

    return (
      <Measure
        whitelist={['width']}
        onMeasure={({ width }) => {
          this.setState({
            containerWidth: width,
          });
        }}
      >
        <Motion
          defaultStyle={{
            slide: 0,
          }}
          style={{
            slide: spring(animateTo, springConfig),
          }}
        >
        {({ slide }) => (
          <Wrapper
            onTouchEnd={() => this.swipeEnd({
              startPosX,
              breakPointRatio,
              activeItemIndex,
              noOfSlides,
              containerWidth,
              lastPosX,
              startDragMillis,
            })}
            onTouchMove={(e) => this.swipeMove(e, {
              startPosX,
              activeItemIndex,
              containerWidth,
              noOfSlides,
            })}
            onTouchStart={(e) => this.swipeStart(e)}
          >
            <Slides>
              {renderSlides.map((renderSlide, index) => (
                <Slide
                  key={index}
                  index={index}
                  activeItemIndex={activeItemIndex}
                  slide={slide}
                  containerWidth={containerWidth}
                >
                {renderSlide({
                  index,
                  slide,
                  activeItemIndex,
                  containerWidth,
                })}
                </Slide>
              ))}
            </Slides>
            {
              enableIndicators &&
              <IndicatorsWrapper indicatorsBottom={indicatorsBottom}>
                <IndicatorsInnerWrapper>
                  {renderSlides.map((renderSlide, index) => (
                    <IndicatorWrapper
                      onClick={() => this.onIndicatorClick(index)}
                      key={index}
                    >
                      <Indicator>
                        <InnerIndicator
                          animateIndicatorTo={animateIndicatorTo}
                          isActive={this.isIndicatorActive({
                            index,
                            activeItemIndex,
                            slide,
                            breakPointRatio,
                          })}
                        />
                      </Indicator>
                    </IndicatorWrapper>
                  ))}
                </IndicatorsInnerWrapper>
              </IndicatorsWrapper>
            }
          </Wrapper>
        )}
        </Motion>
      </Measure>
    );
  }
}

