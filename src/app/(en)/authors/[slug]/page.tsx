import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/navigation/SiteFrame";
import { getPublicAuthorPage } from "@/data/api/author-profiles";
import { siteConfig } from "@/config/site";
import styles from "./AuthorPage.module.css";

interface Props { readonly params: Promise<{slug: string}>; readonly searchParams: Promise<{page?:string}>; }
function pageNumber(value?: string): number | null {
  if(!value) return 1;
  if(!/^[1-9][0-9]{0,2}$/.test(value) || Number(value)>100) return null;
  return Number(value);
}
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata>{
  const {slug}=await params;
  const current=pageNumber((await searchParams).page);
  const data=current?await getPublicAuthorPage(slug,current):null;
  if(!data || current===null)return {title:"Author not found",robots:{index:false,follow:false}};
  const canonical=`${siteConfig.origin}/authors/${slug}/${current>1?`?page=${current}`:""}`;
  return {title:`${data.profile.displayName} — Author`,description:data.profile.bio||`Editorial articles by ${data.profile.displayName} on ScreenWhy.`,
    alternates:{canonical},robots:{index:siteConfig.allowIndexing,follow:siteConfig.allowIndexing},
    openGraph:{title:`${data.profile.displayName} — ScreenWhy`,url:canonical,type:"website"}};
}
export default async function AuthorPage({params,searchParams}:Props){
  const {slug}=await params; const current=pageNumber((await searchParams).page);
  const data=current?await getPublicAuthorPage(slug,current):null;
  if(!data || current===null) return notFound();
  const {profile,articles,page,hasMore}=data;
  const canonical=`${siteConfig.origin}/authors/${slug}/`;
  const personSchema={"@context":"https://schema.org","@type":"ProfilePage","url":canonical,"mainEntity":{"@type":"Person","name":profile.displayName,"url":canonical,
    ...(profile.roleTitle?{"jobTitle":profile.roleTitle}:{}),...(profile.portraitUrl?{"image":profile.portraitUrl}:{})}};
  return <SiteFrame locale="en-US" activePath={`/authors/${slug}/`}>
    <section className={styles.page} aria-labelledby="author-heading">
      <nav aria-label="Breadcrumb"><Link href="/">Home</Link> / Authors</nav>
      <header className={styles.header}>
        {profile.portraitUrl?<img className={styles.avatar} src={profile.portraitUrl} alt={`Portrait of ${profile.displayName}`} width="128" height="128"/>:null}
        <div><h1 id="author-heading">{profile.displayName}</h1>{profile.roleTitle?<p>{profile.roleTitle}</p>:null}{profile.bio?<p>{profile.bio}</p>:null}
          {profile.website?<p><a rel="noopener noreferrer" target="_blank" href={profile.website}>Website</a></p>:null}</div>
      </header>
      <h2>Published explanations</h2>
      <ul className={styles.list}>{articles.map(article=><li key={article.slug}><h3><Link href={`/explain/${article.slug}/`}>{article.title}</Link></h3>{article.excerpt?<p>{article.excerpt}</p>:null}</li>)}</ul>
      <nav className={styles.pagination} aria-label="Author article pages">
        {page>1?<Link href={page===2?`/authors/${slug}/`:`/authors/${slug}/?page=${page-1}`}>Previous</Link>:null}
        <span>Page {page}</span>{hasMore?<Link href={`/authors/${slug}/?page=${page+1}`}>Next</Link>:null}
      </nav>
      {siteConfig.allowIndexing?<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(personSchema).replace(/</g,"\\u003c")}}/>:null}
    </section>
  </SiteFrame>;
}
