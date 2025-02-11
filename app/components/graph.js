import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import constants from 'social-visualization/utils/constants';

export default class GraphComponent extends Component {
  @service postStream;

  // Here we just filter the posts by type and return them as day and hour
  get processedData() {
    return this.postStream.getPostsByType(this.args.type).map((post) => {
      const date = new Date(post.timestamp * 1000);
      return {
        day: date.getUTCDay(),
        hour: date.getUTCHours(),
      };
    });
  }

  //Width and Height
  get width() {
    return constants.graphSizes[this.args.size].width;
  }

  get height() {
    return constants.graphSizes[this.args.size].height;
  }
}
