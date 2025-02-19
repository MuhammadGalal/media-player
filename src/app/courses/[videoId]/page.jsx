"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "@/app/components/VideoPlayer";
import Breadcrumb from "@/app/components/Breadcrumb";
import Videos from "@/app/data/Videos";
import { FaRegFileAlt, FaCheckCircle } from "react-icons/fa";
import { CiLock, CiClock2 } from "react-icons/ci";
import { GrLanguage } from "react-icons/gr";
import { FcReading } from "react-icons/fc";
import { RiBookShelfLine } from "react-icons/ri";
import styles from "./VideoDetails.module.css";

export default function VideoDetails() {
  const { videoId } = useParams();
  const video = Videos.find((video) => video.id === videoId);
  const [watched, setWatched] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const savedWatched = localStorage.getItem(`watched_${videoId}`);
    const savedComments = localStorage.getItem(`comments_${videoId}`);
    const savedDraft = localStorage.getItem(`commentDraft_${videoId}`);

    if (savedWatched) setWatched(JSON.parse(savedWatched));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedDraft) setComment(savedDraft);
  }, [videoId]);

  useEffect(() => {
    localStorage.setItem(`watched_${videoId}`, watched.toString());
    window.dispatchEvent(new Event('storage'));
  }, [watched, videoId]);
  

  useEffect(() => {
    localStorage.setItem(`comments_${videoId}`, JSON.stringify(comments));
  }, [comments, videoId]);

  useEffect(() => {
    localStorage.setItem(`commentDraft_${videoId}`, comment);
  }, [comment, videoId]);

  const handleVideoProgress = (progress) => {
    // console.log("progress Update:", progress.played);
    if (!watched && progress.played >= 0.8) {
      // console.log('80% - watched');

      setWatched(true);
    }
  };
  useEffect(() => {
    const savedWatched = localStorage.getItem(`watched_${videoId}`);
    setWatched(savedWatched === 'true');
  }, [videoId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        date: new Date().toLocaleDateString(),
        author: "Student Name"
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const breadcrumb = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/courses" },
    { label: video.title, path: `/courses/${video.id}` },
  ];

  return (
    <>
      <header className={styles.header}>
        <Breadcrumb items={breadcrumb} />
        <h1>
          {video.title}
          {watched && <FaCheckCircle className={styles.watchedIcon} />}
        </h1>
      </header>

      <div className={styles.videoDetails}>
        <div style={{ width: "100%" }} className="col">
          <VideoPlayer 
            url={video.video} 
            onProgress={handleVideoProgress}
          />
          
          <h3>Course Materials</h3>
          <div className={styles.courseDetails}>
            <div className={styles.row}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <CiClock2 />
                <p>Duration:</p>
                <p>3 weeks</p>
              </div>
            </div>
            <div className={styles.row}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <RiBookShelfLine />
                <p>Lessons:</p>
                <p>8</p>
              </div>
            </div>
            <div className={styles.row}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <FcReading />
                <p>Enrolled:</p>
                <p>65 students</p>
              </div>
            </div>
            <div className={styles.row}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <GrLanguage />
                <p>Language:</p>
                <p>English</p>
              </div>
            </div>
          </div>

          <h3>Comments</h3>
          <div className={styles.comments}>
            {comments.map(comment => (
              <div key={comment.id}  style={{gap: '20px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                <Image src="/profile.jpg" width={80} height={80} alt={video.title} style={{borderRadius: '50%'}} />
                <div className="commentDetails">
                  <h4>{comment.author}</h4>
                  <p>{comment.date}</p>
                  <p>{comment.text}</p>
                </div>
                  <hr />
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment"
              rows={4}
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>

        <div className={styles.sections}>
          <h3>Topics for This Course</h3>
          <section>
            <h3>Week 1 - 4</h3>
            <p>Advanced story telling techniques for writers: <br /> Personas, Characters & Plots</p>
            <hr />
            {[
              "Introduction",
              "Course Overview",
              "Course Exercise / Reference Files",
              "Code Editor Installation (Optional if you have one)",
              "Embedding PHP in HTML"
            ].map((topic, index) => (
              <div key={index} className={styles.row}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaRegFileAlt />
                  <p>{topic}</p>
                </div>
                <CiLock />
              </div>
            ))}
          </section>
          <section>
            <h3>Week 5 - 8</h3>
            <p>Advanced story telling techniques for writers: <br /> Personas, Characters & Plots</p>
            <hr />
            {[
              "Defining Functions",
              "Function Parameters",
              "Return Values from Functions",
              "Global variable and scope",
              "Newer way of creating a constant",
              "Constants"
            ].map((topic, index) => (
              <div key={index} className={styles.row}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <FaRegFileAlt />
                  <p>{topic}</p>
                </div>
                <CiLock />
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
