import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import constants from 'social-visualization/utils/constants';

export default class HeaderComponent extends Component {
    @service postStream;
    @tracked isStreaming = this.postStream.isStreaming;

    get postsCount() {
        return this.postStream.getPostCounts();
    }

    //Display the last four posts for style
    get lastsPostsDisplay() {
        const lastFour = this.postStream.lastFourPosts();
        if (!lastFour || lastFour.length === 0) {
            return ['loading ...'];
        }
        return lastFour.map((post) => {
            const postTime = new Date(post.timestamp * 1000);
            const hours = postTime.getHours() % 12 || 12;
            const period = postTime.getHours() >= 12 ? 'PM' : 'AM';
            const day = postTime.getUTCDay();
            return `${constants.weekDays[day]} ${hours} ${period} ${post.type}`;
        });
    }

    @action
    toggleStream() {
        this.postStream.toggleStreaming();
        this.isStreaming = this.postStream.isStreaming;
    }
}
