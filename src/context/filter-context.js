import React from 'react';

const defaultState = {
  genre: [],
};

const FilterContext = React.createContext(defaultState);

const { Provider, Consumer: FilterConsumer } = FilterContext;

class FilterProvider extends React.Component {
  state = {
    genre: [],
  };

  actions = {
    setGenre: genre => {
      this.setState({ genre });
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export { FilterProvider, FilterConsumer };
