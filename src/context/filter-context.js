import React from 'react';

const defaultState = {
  director: [],
  cast: [],
  genre: [],
};

const FilterContext = React.createContext(defaultState);

const { Provider, Consumer: FilterConsumer } = FilterContext;

class FilterProvider extends React.Component {
  state = {
    director: [],
    cast: [],
    genre: [],
  };

  actions = {
    setData: key => data => {
      this.setState({
        [key]: data,
      });
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export { FilterProvider, FilterConsumer };
