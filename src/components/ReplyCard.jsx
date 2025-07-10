import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faReply, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';

export default function ReplyCard({ reply, currentUser, setComments, commentId, setOverlay}) {


  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const isCurrentUser = reply.user.username === currentUser.username
  const formRef = useRef(null)
  const btnRef = useRef(null)

  function timeAgo(timestamp) {
    if (timestamp === "1 week ago") return"1 week ago"
    if (timestamp === "2 days ago") return "2 days ago"
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);
    if (secondsAgo < 60) return "just now";
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} mins ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
    return `${Math.floor(secondsAgo / 86400)} days ago`;
  }

  function deleteReply(commentId, replyId) {
    setComments(prevComments => prevComments.map(comment => (
      commentId === comment.id ? { ...comment, replies: comment.replies.filter(reply => replyId !== reply.id) } : comment
    )))
    setOverlay(false)
    setIsDeleting(false)
  }
 
  function updateReply(event, commentId, replyId) {
    event.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const updatedContent = formData.get("updated-content").trim()
      if (updatedContent) {
        setComments(prevComments => prevComments.map(comment => (
        commentId === comment.id ? {
          ...comment,
          replies: comment.replies.map(reply =>
          replyId === reply.id ? {...reply, content: updatedContent} : reply
        )} : comment
      )))
      setIsEditing(preveState => !preveState)
      } else {
        btnRef.current.disabled = true
      }
    }
  }

  function handleScore(commentId, replyId, delta) {
    setComments(prevComments => prevComments.map(comment => (
      commentId === comment.id ? {
        ...comment,
        replies: comment.replies.map(reply => (
          replyId === reply.id ? { ...reply, score: reply.score > 0 ? reply.score + delta : delta > 0 ? reply.score + delta : reply.score} : reply
        ))
      } : comment
    )))
  }

  return (
    <>
      <section className="reply-card">
        <div className="buttons">
          <button>
            <FontAwesomeIcon
              onClick={()=>handleScore(commentId, reply.id, 1)}
              className="icon"
              icon={faPlus} />
          </button>
          <span>{reply.score}</span>
          <button>
            <FontAwesomeIcon
              onClick={()=>handleScore(commentId, reply.id, -1)}
              className="icon"
              icon={faMinus} />
          </button>
        </div>
        <div className="reply-info">
          <div className="header">
            <div className="left">
              <img src={reply.user.image.png} alt="Avatar" />
              <span className="username">{reply.user.username}</span>
              <span className='you'>you</span>
              <span className="time">{timeAgo(reply.createdAt)}</span>
            </div>
            <div className="right">
              {isCurrentUser ?
                <>
                  <button
                    onClick={() => {
                      setOverlay(true)
                      setIsDeleting(true)
                    }}
                    className='delete-btn'>
                    <FontAwesomeIcon className="icon"
                      icon={faTrash}
                    />
                    <span>Delete</span>
                  </button> 
                  <button onClick={()=> setIsEditing(prevState => !prevState)}>
                    <FontAwesomeIcon className="icon"
                      icon={faEdit}
                    />
                    <span>Edit</span>
                  </button> 
                </> :
              <button>
                <FontAwesomeIcon className="icon"
                  icon={faReply}
                />
                <span>Reply</span>
              </button> 
            }
            </div>
          </div>
          {isEditing ? 
            <form
              ref={formRef}
              className="updating-form">
              <textarea name="updated-content"
                value={reply.contents}>
              </textarea>
              <button
                ref={btnRef}
                onClick={(event) => { updateReply(event, commentId, reply.id) }}
              >Update</button>
            </form> :
            <p className="content">
              <span className='replyingTo'>@{reply.replyingTo}</span> {reply.content}
            </p>
          }
        </div>
      </section>
      {isDeleting &&<section className="delete-msg">
        <p>Delete reply</p>
        <p>Are you sure want to delete this reply? this
        will remove reply and can't be undone.</p>
        <div>
          <button
            onClick={() => {
              setIsDeleting(false)
              setOverlay(false)
            }}
          >No, cancel</button>
          <button
            onClick={ ()=> deleteReply(commentId, reply.id) }
          >Yes, delete</button>
        </div>
      </section>}
    </>
  )
}