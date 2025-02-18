'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';
import Videos from '../data/Videos';
import styles from "./Courses.module.css";

export default function Courses() {
    const [watchedVideos, setWatchedVideos] = useState({});

    useEffect(() => {
      const loadWatchedStatus = () => {
        const status = {};
        Videos.forEach(video => {
          const watched = localStorage.getItem(`watched_${video.id}`);
          status[video.id] = watched === 'true';
        });
        setWatchedVideos(status);
      };

      // Load initial status
      loadWatchedStatus();

      // Listen for storage changes
      const handleStorageChange = (e) => {
        if (e.key?.startsWith('watched_')) {
          loadWatchedStatus();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
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
        <ul>
          {Videos.map((video) => (
            <li key={video.id}>
              <Link href={`/courses/${video.id}`}>
                <Image 
                  src={video.image} 
                  width={360} 
                  height={260} 
                  alt={video.title}
                  className={styles.courseImage}
                />
                <h2>
                  {video.title}
                  {watchedVideos[video.id] && 
                    <FaCheckCircle className={styles.watchedBadge} />}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
}