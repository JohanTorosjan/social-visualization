import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class HeaderComponent extends Component {
  @service postStream; // Service pour récupérer les posts
  @tracked isStreaming = this.postStream.isStreaming; 
 
  get postsCount () {

return this.postStream.getPostCounts()

 }

 get lastsPostsDisplay(){
    const lastFour = this.postStream.lastFourPosts()
    console.log("📢 Derniers posts:", lastFour)
    if (!lastFour || lastFour.length === 0) {
        return ["loading ..."]; // Si aucun post, affiche un message
    }

    ; // Debug pour voir les posts dans la console

    // Formater les posts en chaînes lisibles
    return lastFour.map(post => {
        const postTime = new Date(post.timestamp * 1000); // Convertir timestamp en date
        const hours = postTime.getHours() % 12 || 12; // Convertir en format 12h
        const period = postTime.getHours() >= 12 ? "PM" : "AM"; // Déterminer AM/PM
        const day = postTime.getUTCDay()
        return `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]} 12 ${period} ${post.type}`;
    });}

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
