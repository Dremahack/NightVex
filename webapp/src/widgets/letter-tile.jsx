import React from 'react';

import { Tinode } from 'tinode-sdk';

import { idToColorClass } from '../lib/strformat.js';
import { sanitizeUrlForMime } from '../lib/utils.js';

import { SELF_AVATAR_URI } from '../config.js';

const NIGHTVEX_AUTH_AVATAR = 'img/nightvex-auth-avatar.png';

export default class LetterTile extends React.PureComponent {
  render() {
    let avatar;
    if (this.props.avatar === true) {
      if (Tinode.isSelfTopicName(this.props.topic)) {
        avatar = <img className="avatar self" alt="avatar" src={SELF_AVATAR_URI} />
      } else {
        const isGroup = Tinode.isGroupTopicName(this.props.topic);
        const iconColor = idToColorClass(this.props.topic, isGroup);

        if (!isGroup) {
          const className = 'avatar nightvex-auth' + (this.props.deleted ? ' deleted' : '');
          avatar = <img className={className} alt="avatar" src={NIGHTVEX_AUTH_AVATAR} />;
        } else if (this.props.topic && this.props.title && this.props.title.trim()) {
          const letter = this.props.title.trim().charAt(0);
          const className = 'lettertile ' + iconColor + (this.props.deleted ? ' disabled' : '');
          avatar = (<div className={className}><div>{letter}</div></div>)
        } else {
          const className = 'material-icons ' + iconColor + (this.props.deleted ? ' disabled' : '');
          avatar = <i className={className}>group</i>;
        }
      }
    } else if (this.props.avatar) {
      const url = this.props.authorizeURL(sanitizeUrlForMime(this.props.avatar, 'image'));
      // If avatar image is invalid, show a placeholder.
      const className = 'avatar' + (this.props.deleted ? ' deleted' : '');
      avatar = <img className={className} alt="avatar" src={url}
        onError={e=>{e.target.onerror = null; e.target.src="img/broken_image.png"}} />;
    } else {
      avatar = null;
    }
    return avatar;
  }
}
