import React from 'react';

import { FilterProvider } from './src/context/filter-context';

export default ({ element }) => <FilterProvider>{element}</FilterProvider>;
