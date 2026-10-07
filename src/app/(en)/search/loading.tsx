import { PageContainer } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/Primitives";
import styles from "@/features/search/SearchPage.module.css";

export default function SearchLoading() {
  return (
    <PageContainer className={styles.page}>
      <div className={styles.loading} role="status" aria-label="Loading search results">
        <Skeleton width="14rem" height="38px" />
        <Skeleton width="100%" height="52px" radius="10px" />
        <Skeleton width="10rem" height="18px" />
        <div className={styles.loadingGrid}>
          <Skeleton height="132px" radius="14px" />
          <Skeleton height="132px" radius="14px" />
          <Skeleton height="132px" radius="14px" />
        </div>
      </div>
    </PageContainer>
  );
}
