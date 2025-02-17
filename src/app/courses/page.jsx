'use client'; 
import { useState ,useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '../components/Breadcrumb';
import Videos from '../data/Videos';
import styles from "./Courses.module.css";

export default function Courses() {
    const [watchedVideos, setWatchedVideos] = useState({});

    useEffect(() => {
      const savedWatched = {};
      Videos.forEach(video => {
        const watched = localStorage.getItem(`watched_${video.id}`);
        if (watched) savedWatched[video.id] = JSON.parse(watched);
      });
      setWatchedVideos(savedWatched);
    }, []);
  
    const breadcrumb = [
      { label: "Home", path: "/" },
      { label: "Courses", path: "/courses" },
    ];
  
    return (
      <div className={styles.courses}>
        <header>
          <Breadcrumb items={breadcrumb} />
          <h1>Dive into the world of programming with our courses.</h1>
        </header>
        {/* <p style={{fontSize: '1.5rem'}} >We offer a wide range of courses that will help you learn programming languages and tools.</p> */}
        <ul>
          {Videos.map((video) => (
            <li key={video.id}>
              <Link href={`/courses/${video.id}`}>
                <Image src={video.image} width={360} height={260} alt={video.title} />
                <h2>
                  {video.title}
                  {watchedVideos[video.id] && <FaCheckCircle style={{ color: 'green', marginLeft: '10px' }} />}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
