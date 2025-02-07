import Model, { attr } from '@ember-data/model';

export default class PostModel extends Model {
  @attr('string') type;
  @attr('number') timestamp;
  @attr('string') author;
  @attr('string') content;
}
