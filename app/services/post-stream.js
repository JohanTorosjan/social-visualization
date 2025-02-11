import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PostStreamService extends Service {
  @tracked postsByType = {};
  @tracked posts = [];
  @tracked isStreaming = false;
  @tracked numberOfPosts = 0;
  @tracked newPost = false;

  eventSource = null;

  constructor() {
    super();
    this.startListening();
  }

  @action
  startListening() {
    if (this.eventSource) return;

    this.newPost = false;
    this.eventSource = new EventSource('https://stream.upfluence.co/stream');

    this.eventSource.onmessage = (event) => {
      const newPost = JSON.parse(event.data);
      const postType = Object.keys(newPost)[0];
      const postData = newPost[postType];

      this.addPost(postType, postData);
    };
    this.isStreaming = true;

    this.eventSource.onerror = (error) => {
      this.stopListening();
      console.log(error)
    };
  }

  @action
  stopListening() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isStreaming = false;
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

  lastPost() {
    if (this.newPost) {
      return this.posts[this.posts.length - 1];
    }
  }
}
