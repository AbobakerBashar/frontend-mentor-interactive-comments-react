import { useEffect, useState } from "react"
import "./App.css"
import CommentCard from "./components/CommentCard"
import CommentForm from "./components/CommentForm"
import data from "../public/data.json"
export default function App() {
  const [overlay, setOverlay] = useState(false)

  const [comments, setComments] = useState(() => {
    const savedData = localStorage.getItem("comments")
    return savedData ? JSON.parse(savedData) : data.comments
  })


  // console.log(comments);
  
  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments))
  }, [comments])

  const commentsCards = comments.map(comment => (
    <CommentCard
      key={comment?.id}
      comment={comment}
      replies={comment?.replies}
      setComments={setComments}
      currentUser={data.currentUser}
      setOverlay={setOverlay}
    />
  ))
  return (
    <main className= {overlay ? "overlay" : undefined}>
      {commentsCards}
      <CommentForm
        currentUser={data.currentUser}
        setComments={setComments}
        comments={comments}
      />
    </main>
  )
}