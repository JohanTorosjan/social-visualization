import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class TypeNavigationComponent extends Component {
    @tracked activeType = { name: this.args.activeType };
    @service postStream;
    @tracked poppedType = this.args.lastPostType;
    @tracked postsCount = {};

    get types() {
        return this.postStream.getAllTypes().map((type) => {
            return {
                name: type,
                count: this.postStream.getPostsByType(type).length,
            };
        });
    }

    get currentIndex() {
        return this.types.findIndex((type) => type.name === this.activeType.name);
    }

    get lastPostType() {
        const type = this.postStream.lastPost()?.type;
        this.postsCount[type] = this.postsCount[type] + 1 || 1;
        return this.postStream.lastPost()?.type;
    }

    get numberOfPosts() {
        const numberOfPosts = this.postStream.getPostsByType(
            this.activeType.name,
        ).length;
        return `${numberOfPosts}\n${numberOfPosts === 1 ? 'post' : 'posts'}`;
    }

    @action
    setActiveType(type) {
        this.activeType = type;
        this.args.onTypeChange(type.name);
    }

    @action
    previousType() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) newIndex = this.types.length - 1;
        this.setActiveType(this.types[newIndex]);
    }

    @action
    nextType() {
        let newIndex = (this.currentIndex + 1) % this.types.length;
        this.setActiveType(this.types[newIndex]);
    }

    @action
    initType() {
        this.setActiveType(this?.types[0]);
    }
}
