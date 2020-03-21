import React from 'react';

const defaultState = {
  title: [],
  director: [],
  cast: [],
  genre: [],
};

const FilterContext = React.createContext(defaultState);

const { Provider, Consumer: FilterConsumer } = FilterContext;

class FilterProvider extends React.Component {
  state = defaultState;

  actions = {
    setData: key => data => {
      this.setState({
        [key]: data,
      });
    },
    clear: () => {
      this.setState(defaultState);
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

export { FilterProvider, FilterConsumer };
