// app/helpers/graph-size.js
import { helper } from '@ember/component/helper';
import constants from 'social-visualization/utils/constants';

export default helper(function graphSize([windowWidth]) {
  if (windowWidth < constants.graphSizes.M.width) {
    return 'S';
  } else if (windowWidth < constants.graphSizes.L.width) {
    return 'M';
  } else {
    return 'L';
  }
});
