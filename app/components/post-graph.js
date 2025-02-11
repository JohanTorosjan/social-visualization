import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PostGraphComponent extends Component {
  @service postStream;
  @tracked activeType = 'loader';
  @tracked windowWidth = window.innerWidth;

  @action
  setActiveGraph(type) {
    this.activeType = type;
  }

  @action
  toggleConnection() {
    this.connectionOpen = !this.connectionOpen;
    if (this.connectionOpen) {
      this.postStream.openConnection();
    } else {
      this.postStream.closeConnection();
    }
  }

  @action
  updateWindowWidth() {
    this.windowWidth = window.innerWidth;
  }

  //We track the window size 
  constructor() {
    super(...arguments);
    window.addEventListener('resize', this.updateWindowWidth);
  }

  // And dont forget to remove the evenListener
  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('resize', this.updateWindowWidth);
  }
}
