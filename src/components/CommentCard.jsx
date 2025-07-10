import Reply from "./ReplyCard"
import ReplyForm from "./ReplyForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faReply, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from "react";

export default function CommentCard({ comment, replies, setComments, currentUser, setOverlay }) {
  const isCurrentUser = comment.user.username === currentUser.username
  const [isReplyShow, setIsReplyShow] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef(null)

  const repliesCards = replies.length ? replies.map(reply => (
      <Reply
      key={reply.id}
      reply={reply}
      setComments={setComments}
      isReplyShow={isReplyShow}
      setIsReplyShow={setIsReplyShow}
      currentUser={currentUser}
      commentId={comment.id}
      setOverlay={setOverlay}
      />
  )) : null


  function timeAgo(timestamp) {
    if (timestamp === "1 month ago") return "1 month ago"
    if (timestamp === "2 weeks ago") return "2 weeks ago"
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);
    if (secondsAgo < 60) return "just now";
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} mins ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
    return `${Math.floor(secondsAgo / 86400)} days ago`;
  }

  function showReply() {
    setIsReplyShow(prevState => !prevState)
  }


  function setDeletUI() {
    setOverlay(true)
    setIsDeleting(true)
  }
  function deleteComment(id) {
    setComments(prevComments => prevComments.filter(comment => (
      id !== comment.id && comment
    )))
    setOverlay(false)
  }

  function showUpdatingForm() {
    setIsEditing(prevState => !prevState)
  }
  function updateComment(event, id) {
    event.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const updatedContent = formData.get("updated-content").trim()
      if (updatedContent)
        setComments(prevComments => prevComments.map(comment => (
          id === comment.id ? { ...comment, content: updatedContent } : comment
        )))
      setIsEditing(prevState => !prevState)      
    }
  }

  function handleScore(id, delta) {
    setComments(prevComments => prevComments.map(comment => (
      comment.id === id ? {
        ...comment,
        score: comment.score > 0 ? comment.score + delta : delta > 0 ? comment.score + delta : comment.score
      } : comment
    )))
  }
  return (
    <div className="container">
      <section className="comment-card">
        <div className="buttons">
          <button>
            <FontAwesomeIcon
              onClick={ ()=> handleScore(comment.id, 1) }
              className="icon"
              icon={faPlus} />
          </button>
          <span>{comment.score}</span>
          <button>
            <FontAwesomeIcon
              onClick={ ()=> handleScore(comment.id, -1) }
              className="icon"
              icon={faMinus} />
          </button>
        </div>
        <div className="comment-info">
          <div className="header">
            <div className="left">
              <img src={comment.user.image.png} alt="Avatar" />
              <span className="username">{comment.user.username}</span>
              <span className="you">you</span>
              <span className="time">{timeAgo(comment.createdAt)}</span>
            </div> 
            <div className="right">
              {isCurrentUser ? 
                <><button
                  className="delete-btn"
                onClick={setDeletUI}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faTrash}
                />
                <span>Delete</span>
              </button>
              <button
                onClick={showUpdatingForm}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faEdit}
                />
                <span>Edit</span>
              </button></> :
              <button
                onClick={showReply}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={faReply}
                />
                <span>Reply</span>
              </button>
            }
            </div>
          </div>
          {!isEditing ? <p className="content">
            {comment.content}
          </p> :
            <form
              ref={formRef}
              className="updating-form">
              <textarea name="updated-content"
                defaultValue={comment.content}
              >
              </textarea>
              <button
                onClick={(event) => { updateComment(event, comment.id) }}
              >Update</button>
            </form>
          }
        </div>
        {isDeleting && <section className="delete-msg">
          <p>Delete comment</p>
          <p>Are you sure want to delete this comment? this
          will remove reply and can't be undone.</p>
          <div>
            <button
              onClick={() => {
                setIsDeleting(false)
                setOverlay(false)
                }
              }
            >No, cancel</button>
            <button
              onClick={ ()=> deleteComment(comment.id) }
            >Yes, delete</button>
          </div>
        </section> }
      </section>
      {isReplyShow && <ReplyForm
        key={comment.id}
        currentUser={currentUser}
        setComments={setComments}
        id={comment.id}
        replyingTo={comment.user.username}
        setIsReplyShow={setIsReplyShow}
      />}
      <div className="replies">
        <span className="line"></span>
        <div>{repliesCards}</div>
      </div>
    </div>
  )
}      