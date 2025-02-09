import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @service postStream; // Service pour récupérer les posts
  @tracked isStreaming = this.postStream.isStreaming; 
 
 
  get postsCount (){
return this.postStream.getPostCounts()

 }

  @action
  toggleStream() {
    this.postStream.toggleStreaming();
    this.isStreaming = this.postStream.isStreaming; 

  }

  @action
  navigateToAbout() {
    window.location.href = "/about"; // Redirection vers la page "About"
  }
}
