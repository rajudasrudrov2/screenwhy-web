import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/Icons";
import type { HomepageGateway } from "./homepage.types";
import styles from "./RouteGatewayCard.module.css";

export function RouteGatewayCard({ gateway }: { readonly gateway: HomepageGateway }) {
  return (
    <article className={styles.card}>
      <Link className={styles.link} href={gateway.href} aria-label={`Browse ${gateway.title} explanations`}>
        <span className={styles.routeMark} aria-hidden="true" />
        <span className={styles.affordance} aria-hidden="true"><ArrowRightIcon size={17} /></span>
        <h3 className={styles.title}>{gateway.title}</h3>
        <p className={styles.description}>{gateway.description}</p>
      </Link>
    </article>
  );
}
