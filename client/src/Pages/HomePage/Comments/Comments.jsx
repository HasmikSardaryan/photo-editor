import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../../../Components/Posts/Posts';
import Comment from '../../../Components/Comment/Comment';
import { formatDistanceToNow } from 'date-fns'
import Header from '../../Header/Header';

const Comments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');


  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await fetch(`http://localhost:3000/comments/post/${postId}`);
        const postData = await postRes.json();
        setPost(postData);

        const commentsRes = await fetch(`http://localhost:3000/comments/${postId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error loading post and comments", err);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:3000/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({text:newComment}),
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      } else {
        if (data.err == 'no token') {
          alert('You must be logged in to comment');
        } else {
          alert(data.error || 'Something went wrong');
        }
      }
    } catch (err) {
      console.error('Failed to submit comment', err);
    }
  };
  return (
    <div className="homepag">
      <Header/>
      {post && (
        <Post
          key={post._id}
          _id={post._id}
          rank={null}
          title={post.title}
          domain={post.url}
          points={post.points}
          author={post.author}
          time={formatDistanceToNow(new Date(post.time), { addSuffix: true })}
          comments={post.comments.length}
        />
      )}

    <div className="comment">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          cols={50}
        />
        <br />
        <button onClick={handleCommentSubmit}>Post Comment</button>
      </div>
      {comments.length > 0 &&
    comments
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .map(comment => (
        <Comment
          key={comment._id}
          author={comment.author}
          text={comment.text}
          time={comment.time}
          _id={comment._id}
        />
      ))
      }

    </div>
  );
};  

export default Comments;

