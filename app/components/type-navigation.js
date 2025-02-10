import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class TypeNavigationComponent extends Component {
  @tracked activeType = this.args.type; // Type actif
  @service postStream; // Injection du service

    get types() {
        return this.postStream.getAllTypes();
    }
  // Trouve l'index du type actif
  get currentIndex() {
    return this.types.indexOf(this.activeType);
  }

  get numberOfPosts() {
    const numberOfPosts = this.postStream.getPostsByType(this.activeType).length
    return `${numberOfPosts}\n${numberOfPosts===1?"post":"posts"}`;
  }


  @action
  setActiveType(type) {
    this.activeType = type;
    this.args.onTypeChange(type); // Émet un événement pour le parent
  }

  @action
  previousType() {
    let newIndex = this.currentIndex - 1;
    if (newIndex < 0) newIndex = this.types.length - 1; // Boucle au dernier type
    this.setActiveType(this.types[newIndex]);
  }

  @action
  nextType() {
    let newIndex = (this.currentIndex + 1) % this.types.length; // Boucle au premier type
    this.setActiveType(this.types[newIndex]);
  }

  @action
  initType(){
    this.setActiveType(this.types[0])
  }
}
