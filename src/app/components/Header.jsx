import Link from "next/link";
import styles from "./Header.module.css";
export default function Header() {
  return (
    <div className={styles.header}>
      <h1>IT Legend Platform for Programming</h1>
      <Link href="/courses">
      Courses
      </Link>
    </div>
  );
}