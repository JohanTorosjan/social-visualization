import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service postStream; // Injecte le service

  model() {
    return this.postStream; // Passe le service comme modèle
  }
}
