import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PostStreamService extends Service {
  @tracked postsByType = {}; // Stocke les posts par type
  @tracked posts = [];
  eventSource = null;

  constructor() {
    super();
    this.startListening();
  }

  @action
  startListening() {
    this.eventSource = new EventSource('https://stream.upfluence.co/stream');

    this.eventSource.onmessage = (event) => {
      const newPost = JSON.parse(event.data);
      const postType = Object.keys(newPost)[0]; // Ex: "twitch_stream"
      const postData = newPost[postType];

      this.addPost(postType, postData);
    };

    this.eventSource.onerror = (error) => {
      console.error('❌ Erreur SSE :', error);
      this.eventSource.close();
    };
  }

  @action
  addPost(type, postData) {
    // Créer une nouvelle référence de l'objet pour forcer la réactivité
    this.postsByType = {
      ...this.postsByType,
      [type]: [...(this.postsByType[type] || []), postData],
    };
    this.posts.push(postData);
  }

  getPostsByType(type) {
    return this?.postsByType[type] || [];
  }

  getAllTypes() {
    return Object.keys(this.postsByType); // Retourne tous les types de posts présents
  }
}
