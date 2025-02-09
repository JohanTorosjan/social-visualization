import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeaderComponent extends Component {
  @service postStream; // Service pour récupérer les posts
  @tracked isStreaming = true; // État du stream
  
  get postCount() {
    return this.postStream.posts.length || 0;
  }

  @action
  toggleStream() {
    this.isStreaming = !this.isStreaming;
    if (this.isStreaming) {
      this.postStream.openConnection();
    } else {
      this.postStream.closeConnection();
    }
  }

  @action
  navigateToAbout() {
    window.location.href = "/about"; // Redirection vers la page "About"
  }
}
