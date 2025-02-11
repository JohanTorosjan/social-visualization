import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PostStreamService extends Service {
  @tracked postsByType = {}; // Stocke les posts par type
  @tracked posts = [];
  @tracked isStreaming = false; // Indique si le stream est actif
  eventSource = null;
  @tracked numberOfPosts = 0;
  @tracked newPost = false;

  constructor() {
    super();
    this.startListening(); // Lancer automatiquement le stream au démarrage
  }

  get postsAsDate() {
    return this.posts.map((post) => {
      const date = new Date(post.timestamp * 1000); // Convertir le timestamp en date
      return {
        day: date.getUTCDay(), // 0 = Dimanche, 6 = Samedi
        hour: date.getUTCHours(), // 0 - 23 (heure UTC)
      };
    });
  }

  @action
  startListening() {
    if (this.eventSource) return; // Empêche de démarrer plusieurs connexions

    this.newPost = false;
    this.eventSource = new EventSource('https://stream.upfluence.co/stream');

    this.eventSource.onmessage = (event) => {
      const newPost = JSON.parse(event.data);
      const postType = Object.keys(newPost)[0]; // Ex: "twitch_stream"
      const postData = newPost[postType];

      this.addPost(postType, postData);
    };
    this.isStreaming = true; // Met à jour l'état

    this.eventSource.onerror = (error) => {
      console.error('❌ Erreur SSE :', error);
      this.stopListening();
    };
  }

  @action
  stopListening() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isStreaming = false; // Met à jour l'état
    }
  }

  @action
  toggleStreaming() {
    if (this.isStreaming) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  @action
  addPost(type, postData) {
    this.postsByType = {
      ...this.postsByType,
      [type]: [...(this.postsByType[type] || []), postData],
    };
    this.posts.push({ ...postData, type });
    this.numberOfPosts += 1;
    this.newPost = true;
  }

  getPostCounts() {
    return this.numberOfPosts;
  }

  getPostsByType(type) {
    return this.postsByType[type] || [];
  }

  getAllTypes() {
    return Object.keys(this.postsByType);
  }

  lastFourPosts() {
    if (this.newPost) {
      return this.posts?.slice(-4).reverse();
    }
  }

  lastPost(){
    if (this.newPost) {
      return this.posts[this.posts.length-1]
    }
  }
} 
