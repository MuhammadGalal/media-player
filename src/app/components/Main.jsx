import Link from "next/link";
import styles from "./Main.module.css";

export default function Main() {
  return (
    <main className={styles.main}>
      <h1>IT Legend Platform for Programming</h1>
      <p>
      It Legend platform offers you an enjoyable journey to learn programming during which you will not feel bored. You will get the information you need smoothly without facing difficulty in learning or spending long hours understanding and navigating between different sources.
      </p>
        <Link href="/courses">
            Explore courses
        </Link>
    </main>
  );
}