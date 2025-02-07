import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PostGraphComponent extends Component {
  @service postStream; // Injection du service
  @tracked activeType = null;

  get posts() {
    console.log(this.postStream.getPostsByType("tiktok_video"))
    return this.postStream.posts;
  } 


  get allTypes() {
    console.log(this.postStream.getAllTypes())
    return this.postStream.getAllTypes(); // Liste dynamique des types de posts
  }
  @action
  setActiveGraph(type) {
    this.activeType = type;
  }
}   
