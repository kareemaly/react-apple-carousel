const getLeftLimits = ({ containerWidth, index }) => -(index * containerWidth);
const getRightLimits = () => 0;

const exceedsLeftLimits = ({ translateX, ...args }) => 
  translateX < getLeftLimits(args);

const exceedsRightLimits = ({ translateX }) =>
  translateX > getRightLimits();

const getLimits = (args) => {
  if(exceedsLeftLimits(args)) {
    return getLeftLimits(args);
  }
  if(exceedsRightLimits(args)) {
    return getRightLimits(args);
  }
  return args.translateX;
}

export const calculateSlidingAnimation = ({ index, containerWidth, slide }) => {
  const x = getLimits({
    translateX: -(containerWidth * slide),
    containerWidth,
    index,
  });
  return { x, y: 0, z: 0 };
}

export const calculateChildrenParallaxAnimation = ({ parallaxValue, index, slide }) => {
  let x = 0, y = 0, z = 0;
  if(Math.floor(slide) === index) {
    z = (slide - index) * parallaxValue;
  } else if(slide > index) {
    z = parallaxValue;
  }
  return { x, y, z };
}

export const calculateImageParallaxAnimation = ({ parallaxValue, index, slide }) => {
  let x = 0, y = 0, z = 0;
  if(Math.floor(slide) === index) {
    x = (slide - index) * parallaxValue * 2;
    y = -(slide - index) * parallaxValue * 2;
    z = (slide - index) * parallaxValue;
  } else if(slide > index) {
    z = parallaxValue;
  }
  return { x, y, z };
}

export const stringifyTranslate = ({ x, y, z }) => `transform: perspective(100px) translate3d(${x}px, ${y}px, ${z}px);`;
