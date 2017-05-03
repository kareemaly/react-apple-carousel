import React from 'react';
import AppleCarousel from './index';
import styled from 'styled-components';
import getRenderSlides from './test-slides';

const Wrapper = styled.div`
`;

const InputsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
`;

const InputWrapper = styled.div`
`;

const Label = styled.label`
  margin-right: 10px;
`;

const Input = styled.input`
`;

export default class Test extends React.Component {
  componentWillMount() {
    this.setState({
      parallaxValue: -15,
    });
  }

  render() {
    const {
      parallaxValue,
    } = this.state;

    return (
      <Wrapper>
        <AppleCarousel
          renderSlides={getRenderSlides(parallaxValue)}
        >
        </AppleCarousel>
        <InputsWrapper>
          <InputWrapper>
            <Label>Parallax value</Label>
            <Input
              type="number"
              value={parallaxValue}
              onChange={(e) => this.setState({ parallaxValue: e.target.value })}
            />
          </InputWrapper>
        </InputsWrapper>
        </Wrapper>
    );
  }
}
