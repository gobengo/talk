import React, {PropTypes} from 'react';
import Comment from './Comment';
import {NEW_COMMENT_COUNT_POLL_INTERVAL} from 'coral-framework/constants/comments';

class Stream extends React.Component {

  static propTypes = {
    refetch: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
    postItem: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    currentUser: PropTypes.shape({
      username: PropTypes.string,
      id: PropTypes.string
    }),

    // dispatch action to add a tag to a comment
    addCommentTag: React.PropTypes.func,

    // dispatch action to remove a tag from a comment
    removeCommentTag: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {activeReplyBox: '', countPoll: null};
    this.setActiveReplyBox = this.setActiveReplyBox.bind(this);
  }

  componentDidMount() {
    const {asset, getCounts, updateCountCache} = this.props;

    updateCountCache(asset.id, asset.commentCount);

    // Note: Apollo's built-in polling doesn't work with fetchMore queries, so a
    // setInterval is being used instead.
    this.setState({
      countPoll: setInterval(() => getCounts({
        asset_id: asset.id,
        limit: asset.comments.length,
        sort: 'REVERSE_CHRONOLOGICAL'
      }), NEW_COMMENT_COUNT_POLL_INTERVAL),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.countPoll);
  }

  setActiveReplyBox (reactKey) {
    if (!this.props.currentUser) {
      const offset = document.getElementById(`c_${reactKey}`).getBoundingClientRect().top - 75;
      this.props.showSignInDialog(offset);
    } else {
      this.setState({activeReplyBox: reactKey});
    }
  }

  render () {
    const {
      comments,
      currentUser,
      asset,
      postItem,
      addNotification,
      postFlag,
      postLike,
      loadMore,
      deleteAction,
      showSignInDialog,
      refetch,
      addCommentTag,
      removeCommentTag,
    } = this.props;

    return (
      <div>
        {
          comments.map(comment =>
            <Comment
              refetch={refetch}
              setActiveReplyBox={this.setActiveReplyBox}
              activeReplyBox={this.state.activeReplyBox}
              addNotification={addNotification}
              depth={0}
              postItem={postItem}
              asset={asset}
              currentUser={currentUser}
              postLike={postLike}
              postFlag={postFlag}
              addCommentTag={addCommentTag}
              removeCommentTag={removeCommentTag}
              loadMore={loadMore}
              deleteAction={deleteAction}
              showSignInDialog={showSignInDialog}
              key={comment.id}
              reactKey={comment.id}
              comment={comment} />
          )
        }
      </div>
    );
  }
}

export default Stream;
