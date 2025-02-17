import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({ items }) {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, index) => (
        <div key={index} className={styles.breadcrumbItem}>
          {index > 0 && <span className={styles.separator}>&#62;</span>}
          {index === items.length - 1 ? (
            <span className={styles.currentPage}>{item.label}</span>
          ) : (
            <Link href={item.path}>
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}