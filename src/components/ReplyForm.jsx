
export default function ReplyForm({ currentUser, setComments, replyingTo, id, setIsReplyShow}) {
  
  function reply(formData) {
    const content = formData.get("reply").trim()
    if (content) {
      const reply = {
        id: Date.now(),
        createdAt: Date.now(),
        content,
        user: currentUser,
        replyingTo,
        score: 0,
      }
      setComments(prevComments => (prevComments.map(comment => (
        id === comment.id ? { ...comment, replies: [...comment.replies, reply] } : comment
      ))))
    }
    setIsReplyShow(prevState => !prevState)
  }

  return (
    <section className="add-reply">
      <form action={reply}>
        <img src={currentUser.image.png} alt="User image" />
        <textarea name="reply"
          placeholder="Reply..."
          aria-label={`Reply into `}
        ></textarea>
        <button>Reply</button>
      </form>
    </section>
  )
}