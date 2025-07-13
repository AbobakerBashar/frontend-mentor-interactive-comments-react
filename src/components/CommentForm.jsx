import { useRef } from 'react'

export default function CommentForm({ currentUser, setComments }) {
  const btnRef = useRef(null)

  function addComment(formData) {
    const content = formData.get("comment").trim()
    if (content) {
      const newComment = {
        id: Date.now(),
        user: currentUser,
        score: 0,
        createdAt: Date.now(),
        content,
        replies: []
      }
      setComments(prevComments => ([
        ...prevComments,
        newComment
      ]))
    } else {
      if (btnRef.current)
        btnRef.disabled = true
    }
  }

  return (
    <section className="add-comment">
      <form action={addComment}>
        <img src={currentUser.image.png} alt="User imge" />
        <textarea name="comment"
          placeholder="Add a comment..."
          aria-label="Add a comment"
        ></textarea>
        <button ref={btnRef}>Send</button>
      </form>
    </section>
  )
}