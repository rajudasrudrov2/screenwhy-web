import { DataAccessError } from "@/data/errors";
import type { CanonContext } from "@/types/domain/canon";
import type { TitleLogicalGroupId } from "@/types/domain/identity";
import type { RenderableArticleBlock, RenderableArticleBody, RenderableArticleInline, RenderableArticleSection } from "@/data/article-body/types";

/** ScreenWhy Core ArticleDocumentMapper v1 wire adapter. No raw HTML crosses this boundary. */
export interface PublicArticleContext {readonly primaryTitleId:TitleLogicalGroupId;readonly canon:CanonContext;}
function invalid(reason:string):never {throw new DataAccessError("malformed_payload",`Unrenderable ScreenWhy article: ${reason}`,{operation:"decode-api-article",resource:"explanation-body"});}
function obj(v:unknown,name:string):Record<string,unknown> {if(!v||typeof v!=="object"||Array.isArray(v))invalid(name);return v as Record<string,unknown>;}
function array(v:unknown,name:string):unknown[]{if(!Array.isArray(v))invalid(name);return v;}
function txt(v:unknown,name:string):string {if(typeof v!=="string"||!v.trim())invalid(name);return v;}
function checkHref(raw:unknown):string {const url=txt(raw,"inline href");if(/^https?:\/\/[^\s<>]+$/i.test(url)){try{new URL(url);}catch{invalid("invalid link URL");}return url;}if(/^mailto:[^\s<>@]+@[^\s<>@]+$/i.test(url))return url;if(/^#[a-z][a-z0-9_-]*$/.test(url))return url;invalid("unsafe inline href");}
function inlines(data:unknown):readonly RenderableArticleInline[]{return array(data,"inline array").map(entry=>{
  const e=obj(entry,"inline item");if(e.kind==="citation"){
    const n=e.index;if(!Number.isSafeInteger(n)||Number(n)<1)return invalid("citation ordinal");return {kind:"citation",citationNumber:n as number};
  }
  if(e.kind!=="text"||typeof e.text!=="string")invalid("unsupported inline kind");
  const text=e.text as string;const bold=e.bold===true,italic=e.italic===true,code=e.code===true;
  for(const key of ["bold","italic","code"])if(e[key]!==undefined&&typeof e[key]!=="boolean")invalid("invalid inline style flag");
  const href=e.href===undefined?undefined:checkHref(e.href);
  if(!bold&&!italic&&!code&&!href)return {kind:"text",text};
  if(bold&&!italic&&!code&&!href)return {kind:"strong",text};
  if(italic&&!bold&&!code&&!href)return {kind:"emphasis",text};
  if(href&&!bold&&!italic&&!code)return {kind:"link",text,href,external:/^https?:/i.test(href)};
  if(code&&!bold&&!italic&&!href)return {kind:"code",text};
  return {kind:"styled",text,bold,italic,code,...(href?{href}:{}),...(href?{external:/^https?:/i.test(href)}:{})};
 });}
function media(value:unknown){const x=obj(value,"image media");if(x.role!=="editorial_image")invalid("unsupported editorial media role");const url=txt(x.url,"image URL");if(!/^https?:\/\//.test(url))invalid("unsafe image URL");if(typeof x.alt!=="string"||!Number.isInteger(x.width)||Number(x.width)<1||!Number.isInteger(x.height)||Number(x.height)<1)invalid("invalid media metadata");return {role:"editorial_image" as const,url,alt:x.alt,width:x.width as number,height:x.height as number};}
function blocks(source:unknown,context:PublicArticleContext,depth=0):readonly RenderableArticleBlock[]{
 if(depth>5)invalid("article nesting too deep");const all=array(source,"article blocks");if(all.length>500)invalid("article block limit");return all.map(entry=>{
  const r=obj(entry,"article block");
  if(r.kind==="paragraph"||r.kind==="blockquote")return {kind:r.kind,content:inlines(r.content)};
  if(r.kind==="list")return {kind:"list",ordered:r.ordered===true,items:array(r.items,"list.items").map(inlines)};
  if(r.kind==="divider")return {kind:"divider"};
  if(r.kind==="image")return {kind:"image",media:media(r.media)};
  if(r.kind==="canon_note"){
    const classification=txt(r.classification,"Canon classification");
    // The PHP DTO carries classification+text but NOT independent Canon scopes. Reuse
    // persisted parent Canon only if classification is IDENTICAL; never invent scopes.
    if(classification!==context.canon.classification)invalid("Canon Note has no independently verified matching scopes");
    const contents=inlines(r.content);
    if(contents.length!==1||contents[0]?.kind!=="text")invalid("unsupported Canon Note content");
    return {kind:"canon_note",context:context.canon,text:contents[0].text};
  }
  if(r.kind==="spoiler"){
    if(r.scopeType!=="title")invalid("unsupported/unapproved Spoiler scope");
    const level=r.level;if(!["spoiler_free","minor","major","full"].includes(String(level)))invalid("unsupported Spoiler level");
    return {kind:"spoiler",metadata:{screen:{level:level as "spoiler_free"|"minor"|"major"|"full",scope:{type:"full_title",titleId:context.primaryTitleId}}},blocks:blocks(r.blocks,context,depth+1)};
  }
  return invalid("unsupported article block type");
 });
}
/** Flattened H2/H3/H4 PHP sections become the existing nested frontend TOC structure. */
export function decodeApiArticleBody(document:unknown,context:PublicArticleContext):RenderableArticleBody{
 const root=obj(document,"article document");if(root.version!=="screenwhy_article_v1")invalid("unsupported article version");
 const intro=blocks(root.intro,context);const wireSections=array(root.sections,"article sections");if(wireSections.length>200)invalid("section count limit");
 const seen=new Set<string>();const flat:({stableKey:string;heading:string;level:2|3|4;blocks:readonly RenderableArticleBlock[];sections:RenderableArticleSection[]})[]=[];
 for(const item of wireSections){const sec=obj(item,"section");const key=txt(sec.stableKey,"section stableKey");if(!/^[a-z][a-z0-9_-]{0,190}$/.test(key)||seen.has(key))invalid("duplicate or invalid section key");seen.add(key);
 const level=sec.level;if(level!==2&&level!==3&&level!==4)invalid("invalid heading level");flat.push({stableKey:key,heading:txt(sec.heading,"section heading"),level,blocks:blocks(sec.blocks,context),sections:[]});}
 const result:typeof flat=[];let h2:typeof flat[number]|undefined;let h3:typeof flat[number]|undefined;
 for(const sec of flat){if(sec.level===2){result.push(sec);h2=sec;h3=undefined;}else if(sec.level===3){if(!h2)invalid("H3 without H2");h2.sections.push(sec);h3=sec;}else{if(!h3)invalid("H4 without H3");h3.sections.push(sec);}}
 return {intro,sections:result};
}
