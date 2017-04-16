import React from 'react';
import styled from 'styled-components';
import { calculateChildrenParallaxAnimation, calculateImageParallaxAnimation, stringifyTranslate } from './animation';

const SlideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.bgColor};
  height: 100%;
  justify-content: ${(props) => props.justifyContent || 'space-between'};
  align-items: center;
`;

const SlideChildren = styled.div`
  ${(props) => stringifyTranslate(calculateChildrenParallaxAnimation(props))}
`;

const SlideImage = styled.img`
  width: 100%;
  max-width: 400px;
  ${(props) => stringifyTranslate(calculateImageParallaxAnimation(props))}
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  margin-bottom: ${(props) => props.bottomMargin}px;
  color: ${(props) => props.color || '#FFF'};
`;

const H4 = styled.h4`
  margin: 0;
  padding: 0;
`;

const H3 = styled.h3`
  margin: 0;
  padding: 0;
`;

const Slide1 = ({ index, slide, parallaxValue }) => (
  <SlideWrapper bgColor={'#cc3341'}>
    <SlideChildren
      parallaxValue={parallaxValue}
      index={index}
      slide={slide}
    >
      <Item color={'#FFF'}>
        <H4>iPhone 7</H4>
        <H3>Now in (Product)</H3>
      </Item>
    </SlideChildren>
    <SlideImage
      parallaxValue={parallaxValue}
      index={index}
      slide={slide}
      src={'https://images.apple.com/v/home/de/images/heroes/iphone7_productred_portrait_small_2x.png'}
    />
  </SlideWrapper>
);

const Slide2 = ({ index, slide, parallaxValue }) => (
  <SlideWrapper bgColor={'#f2f2f2'}>
    <SlideChildren
      parallaxValue={parallaxValue}
      index={index}
      slide={slide}
    >
      <Item color={'#333'}>
        <H4>iPhone 6</H4>
        <H3>Now in (Product)</H3>
      </Item>
    </SlideChildren>
    <SlideImage
      parallaxValue={parallaxValue}
      index={index}
      slide={slide}
      src={'https://images.apple.com/v/home/de/images/heroes/watch_small_2x.jpg'}
    />
  </SlideWrapper>
);

const Slide3 = ({ index, slide, parallaxValue }) => (
  <SlideWrapper justifyContent={'flex-start'} bgColor={'#fafafa'}>
    <SlideChildren
      parallaxValue={parallaxValue}
      index={index}
      slide={slide}
    >
      <Item color={'#333'} bottomMargin={60}>
        <H4>iPhone 6</H4>
        <H3>Now in (Product)</H3>
      </Item>
    </SlideChildren>
    <SlideImage
      parallaxValue={parallaxValue}
      index={index}
      slide={slide}
      src={'https://images.apple.com/v/home/de/images/heroes/ipad_availability_small_2x.jpg'}
    />
  </SlideWrapper>
);

export default (parallaxValue) => ([
  ({ index, slide }) => <Slide1 index={index} parallaxValue={parallaxValue} slide={slide} />,
  ({ index, slide }) => <Slide2 index={index} parallaxValue={parallaxValue} slide={slide} />,
]);