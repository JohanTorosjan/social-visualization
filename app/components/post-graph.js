import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PostGraphComponent extends Component {
  @service postStream; // Injection du service
  @tracked activeType = 'loader';

  @tracked windowWidth = window.innerWidth; // Suivi de la largeur d'écran


  get allTypes() {
    console.log(this.postStream.getAllTypes());
    return this.postStream.getAllTypes(); // Liste dynamique des types de posts
  }

  @action
  setActiveGraph(type) {
    this.activeType = type;
  }


  @action
  setHotSpot(){
    debugger
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

  constructor() {
    super(...arguments);

    window.addEventListener('resize', this.updateWindowWidth);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('resize', this.updateWindowWidth);
  }
}
