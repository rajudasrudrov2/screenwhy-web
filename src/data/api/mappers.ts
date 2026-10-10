import type { LocaleCode } from "@/lib/i18n/locales";
import type { TitleLookupResult, ExplanationLookupResult, CharacterLookupResult, SearchResult } from "@/data/repositories/contracts";
import type { PaginatedResult } from "@/data/repositories/pagination";
import type { TitleLookupQuery, TitleListQuery, ExplanationLookupQuery, ExplanationListQuery, CharacterLookupQuery, CharacterListQuery, SearchQuery, RelationshipQuery, TimelineQuery } from "@/data/repositories/queries";
import type { TitleSummary } from "@/types/domain/title";
import type { ExplanationSummary } from "@/types/domain/explanation";
import type { CharacterSummary } from "@/types/domain/character";
import type { CharacterRelationship } from "@/types/domain/relationship";
import type { TimelineEvent } from "@/types/domain/timeline";
import { DataAccessError } from "@/data/errors";
import { decodeApiArticleBody } from "@/data/article-body/api-decoder";
import { assertArticleEvidenceIntegrity } from "@/data/article-body";
import type { PublicCitation } from "@/types/domain/source";

export const API_MAPPING_OPERATIONS=["title.lookup","title.list","explanation.lookup","explanation.list","character.lookup","character.list","search.list","story.relationships","story.timeline"] as const;
export type ApiMappingOperation=(typeof API_MAPPING_OPERATIONS)[number];
export interface ApiDomainMappers {
 assertReady(operation:ApiMappingOperation):void;
 mapTitleLookup<T extends LocaleCode>(payload:unknown,query:TitleLookupQuery<T>):TitleLookupResult<T>;
 mapTitleList<T extends LocaleCode>(payload:unknown,query:TitleListQuery<T>):PaginatedResult<TitleSummary<T>>;
 mapExplanationLookup<T extends LocaleCode>(payload:unknown,query:ExplanationLookupQuery<T>):ExplanationLookupResult<T>;
 mapExplanationList<T extends LocaleCode>(payload:unknown,query:ExplanationListQuery<T>):PaginatedResult<ExplanationSummary<T>>;
 mapCharacterLookup<T extends LocaleCode>(payload:unknown,query:CharacterLookupQuery<T>):CharacterLookupResult<T>;
 mapCharacterList<T extends LocaleCode>(payload:unknown,query:CharacterListQuery<T>):PaginatedResult<CharacterSummary<T>>;
 mapSearch<T extends LocaleCode>(payload:unknown,query:SearchQuery<T>):PaginatedResult<SearchResult<T>>;
 mapRelationships(payload:unknown,query:RelationshipQuery):readonly CharacterRelationship[];
 mapTimeline(payload:unknown,query:TimelineQuery):readonly TimelineEvent[];
}
export function malformed(what:string):never {throw new DataAccessError("malformed_payload",`Invalid ScreenWhy public REST DTO: ${what}`,{operation:"decode-public-dto"});}
export type Obj=Record<string,unknown>;
export function rec(value:unknown,label="object"):Obj { if(!value||typeof value!=="object"||Array.isArray(value)) malformed(label);return value as Obj; }
export function list(value:unknown,label:string):unknown[]{if(!Array.isArray(value))malformed(label);return value;}
export function str(value:unknown,label:string):string {if(typeof value!=="string"||!value.trim())malformed(label);return value;}
export function nullableString(value:unknown,label:string):string|undefined {if(value===undefined||value===null||value==="")return undefined;return str(value,label);}
export function num(value:unknown,label:string):number {if(typeof value!=="number"||!Number.isFinite(value))malformed(label);return value;}
export function integer(value:unknown,label:string,min=0):number {const n=num(value,label);if(!Number.isInteger(n)||n<min)malformed(label);return n;}
export function enumStr<T extends string>(value:unknown,allowed:readonly T[],label:string):T {if(typeof value!=="string"||!allowed.includes(value as T))malformed(label);return value as T;}
export function uuid(value:unknown,label:string):string {const s=str(value,label);if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(s))malformed(label);return s;}
export const VERIFICATIONS=["unverified","source_checked","fact_checked","approved"] as const;
const FAMILIES=["movies","tv","anime","k-drama","documentaries"] as const;
const TYPES=["movie","tv_series","miniseries","documentary","tv_special","web_series","other_screen_story"] as const;
const EXPL_TYPES=["ending_explained","character_explained","mystery_explained","scene_explained","relationship_explained","timeline_explained","what_happens_next","book_vs_screen","recap","question_answer"] as const;
const CANONS=["tv_canon","movie_canon","novel_canon","book_canon","manga_canon","game_canon","adaptation_difference","interpretation","unconfirmed_speculative"] as const;
const SPOILERS=["spoiler_free","minor","major","full"] as const;
const STAGES=["drafting","researching","fact_check","editorial_review","ready","published","needs_update"] as const;
function identity(value:unknown,kind:"title"|"character"|"explanation"){const r=rec(value,"identity"),v=rec(r.localization,"identity.localization"),current=rec(v.currentVariant,"currentVariant");if(r.kind!==kind||v.requestedLocale!=="en-US"||v.primaryLocale!=="en-US"||current.locale!=="en-US"||current.published!==true||current.publicationState!=="published")malformed("published identity");uuid(r.logicalId,"logicalId");uuid(current.variantId,"variantId");str(current.slug,"variant slug");return r;}
function verification(value:unknown){const r=rec(value,"verification");enumStr(r.state,VERIFICATIONS,"verification.state");if(r.verifiedAt!==undefined)str(r.verifiedAt,"verification.verifiedAt");return r;}
function media(value:unknown){const r=rec(value,"media");enumStr(r.role,["poster","backdrop","character_portrait","editorial_image","social_image"] as const,"media.role");const url=str(r.url,"media.url");if(!/^https?:\/\//.test(url))malformed("media URL");if(typeof r.alt!=="string")malformed("media alt");integer(r.width,"media.width",1);integer(r.height,"media.height",1);return r;}
function seo(value:unknown){const r=rec(value,"seo");const url=str(r.canonicalUrl,"seo.canonicalUrl");if(!/^https?:\/\//.test(url)||typeof r.index!=="boolean")malformed("seo");return r;}
function titleRef(value:unknown){const r=rec(value,"title reference");uuid(r.logicalId,"title reference ID");if(r.locale!=="en-US")malformed("title reference locale");str(r.slug,"title reference slug");str(r.displayTitle,"title reference title");enumStr(r.publicRouteFamily,FAMILIES,"title reference family");return r;}
function charRef(value:unknown){const r=rec(value,"character reference");uuid(r.logicalId,"character reference ID");if(r.locale!=="en-US")malformed("character reference locale");str(r.slug,"character reference slug");str(r.displayName,"character reference name");return r;}
function explRef(value:unknown){const r=rec(value,"explanation reference");uuid(r.logicalId,"explanation reference ID");if(r.locale!=="en-US")malformed("explanation reference locale");str(r.slug,"explanation reference slug");str(r.articleTitle,"explanation reference title");return r;}
function canon(value:unknown){const r=rec(value,"canon");enumStr(r.classification,CANONS,"canon classification");const scopes=list(r.scopes,"canon scopes");if(scopes.length<(r.classification==="adaptation_difference"?2:1))malformed("canon scope count");for(const scope of scopes){const s=rec(scope,"canon scope"),t=rec(s.target,"canon target");if(t.kind==="title")uuid(t.titleId,"canon title ID");else if(t.kind==="source_work")uuid(t.sourceWorkId,"canon source work ID");else malformed("canon target type");}return r;}
function spoiler(value:unknown){const r=rec(value,"spoiler");const screen=rec(r.screen,"spoiler.screen");enumStr(screen.level,SPOILERS,"spoiler level");if(screen.scope!==undefined)malformed("unsupported explicit global spoiler scope");if(r.sourceMaterial!==undefined){const sm=rec(r.sourceMaterial,"source spoiler");enumStr(sm.level,["none","minor","major","full"] as const,"source spoiler level");}return r;}
function term(value:unknown){const r=rec(value,"term");str(r.slug,"term slug");str(r.label,"term label");return r;}
function dates(value:unknown){const r=rec(value,"editorial dates");for(const k of ["datePublished","dateModified","lastReviewed"])if(r[k]!==undefined)str(r[k],`dates.${k}`);return r;}
function validateSummary(value:unknown,kind:"title"|"character"|"explanation"):Obj {
 const r=rec(value,`${kind} DTO`);identity(r.identity,kind);verification(r.verification);
 if(kind==="title"){
  str(r.displayTitle,"displayTitle");enumStr(r.titleType,TYPES,"titleType");enumStr(r.publicRouteFamily,FAMILIES,"publicRouteFamily");if(r.releaseYear!==undefined)integer(r.releaseYear,"releaseYear",1);if(r.poster!==undefined)media(r.poster);
  if(r.release!==undefined){const release=rec(r.release,"release");if(release.releaseStatus!==undefined)str(release.releaseStatus,"releaseStatus");}
  if(r.classifications!==undefined){const c=rec(r.classifications,"classifications");for(const k of ["genres","countries","platforms","originalLanguages"])if(c[k]!==undefined)list(c[k],k).forEach(term);}
 } else if(kind==="character"){
  str(r.displayName,"displayName");titleRef(r.primaryTitleContext);if(r.portrait!==undefined)media(r.portrait);
 } else {
  str(r.articleTitle,"articleTitle");enumStr(r.explanationType,EXPL_TYPES,"explanationType");titleRef(r.primaryTitle);spoiler(r.spoiler);canon(r.canon);dates(r.dates);
 }
 return r;
}
function detail(value:unknown,kind:"title"|"character"|"explanation"):Obj {
 const r=validateSummary(value,kind);
 seo(r.seo);
 if(kind==="title"){
  if(typeof r.spoilerFreePremise!=="string")malformed("premise");const release=rec(r.release,"release");str(release.releaseStatus,"release status required for Title detail");const c=rec(r.classifications,"classifications");for(const k of ["genres","countries","originalLanguages","platforms"])if(c[k]!==undefined)list(c[k],k).forEach(term);
  if(r.importantCharacters!==undefined)list(r.importantCharacters,"characters").forEach(charRef);
  if(r.relatedExplanations!==undefined)list(r.relatedExplanations,"related explanations").forEach(explRef);
  if(r.installments!==undefined)list(r.installments,"installments").forEach(v=>{const x=rec(v);uuid(x.installmentId,"installment ID");uuid(x.titleId,"installment Title ID");enumStr(x.kind,["season","episode","special","part"] as const,"installment kind");enumStr(x.verificationState,VERIFICATIONS,"installment verification");});
  if(r.backdrop!==undefined)media(r.backdrop);
  if(r.relatedTitles!==undefined)list(r.relatedTitles,"related Titles").forEach(v=>{const x=rec(v);enumStr(x.relationshipType,["sequel_to","prequel_to","spin_off_of","remake_of","continuation_of","shared_story_context","related_to"] as const,"Title relation");titleRef(x.title);});
  if(r.sourceWorks!==undefined)list(r.sourceWorks,"Source Works").forEach(v=>{const x=rec(v);enumStr(x.relationshipType,["adapted_from","based_on"] as const,"Source Work relation");const sw=rec(x.sourceWork);uuid(sw.sourceWorkId,"Source Work identity");str(sw.officialTitle,"Source Work title");enumStr(sw.workType,["novel","book","manga","comic","light_novel","game","other_source_work"] as const,"Source Work type");enumStr(sw.verificationState,VERIFICATIONS,"Source Work verification");});
 } else if(kind==="character"){
  list(r.titleContexts,"titleContexts").forEach(titleRef);
  if(r.performers!==undefined)list(r.performers,"performers").forEach(v=>{const x=rec(v);str(x.performerName,"performer name");titleRef(x.titleContext);});
  if(r.relatedExplanations!==undefined)list(r.relatedExplanations,"related explanations").forEach(explRef);
  if(r.additionalMedia!==undefined)list(r.additionalMedia,"additional media").forEach(media);
 } else {
  str(r.quickAnswer,"quickAnswer");enumStr(r.editorialStage,STAGES,"editorialStage");if(r.publicationState!=="published")malformed("publicationState");const body=rec(r.body,"article body");if(body.format!=="structured_document")malformed("article format");rec(body.document,"structured document");const author=rec(r.author,"author");integer(author.userId,"author ID",1);str(author.displayName,"author name");if(r.reviewerEditor!==undefined){const reviewer=rec(r.reviewerEditor);integer(reviewer.userId,"reviewer ID",1);str(reviewer.displayName,"reviewer name");}
  if(r.secondaryTitles!==undefined)list(r.secondaryTitles,"secondary titles").forEach(titleRef);
  if(r.relatedCharacters!==undefined)list(r.relatedCharacters,"related characters").forEach(charRef);
  if(r.relatedExplanations!==undefined)list(r.relatedExplanations,"related explanations").forEach(explRef);
  if(r.citations!==undefined)list(r.citations,"citations").forEach(v=>{const c=rec(v,"citation"),s=rec(c.source,"citation source");uuid(s.sourceId,"source ID");if(c.publicVisibility!==true)malformed("private citation");enumStr(c.verificationState,VERIFICATIONS,"citation verification");enumStr(s.verificationState,VERIFICATIONS,"source verification");if(!["source_checked","fact_checked","approved"].includes(c.verificationState as string)||!["source_checked","fact_checked","approved"].includes(s.verificationState as string))malformed("unverified public evidence");str(s.sourceTitle,"source title");});
  const parsedArticle=decodeApiArticleBody(body.document,{primaryTitleId:rec(r.primaryTitle).logicalId as never,canon:r.canon as never});
  assertArticleEvidenceIntegrity(parsedArticle,(r.citations??[]) as PublicCitation[]);
 }
 return r;
}
function envelope(value:unknown,detailMode:boolean){const r=rec(value,"REST response"),m=rec(r.meta,"response.meta");if(m.apiVersion!=="1"||m.locale!=="en-US")malformed("REST contract version or locale");if(detailMode)rec(r.data,"response.data");else list(r.data,"response.data");return r;}
function collection<T>(payload:unknown,query:{page?:number;pageSize?:number},map:(item:unknown)=>T):PaginatedResult<T>{const r=envelope(payload,false),p=rec(r.pagination,"pagination");const page=integer(p.page,"page",1),pageSize=integer(p.pageSize,"pageSize",1),totalItems=integer(p.totalItems,"totalItems"),totalPages=integer(p.totalPages,"totalPages");if(page!==(query.page??1)||pageSize!==(query.pageSize??20)||pageSize>50||totalPages!==(totalItems===0?0:Math.ceil(totalItems/pageSize)))malformed("pagination mismatch");const items=list(r.data,"data").map(map);if(items.length>pageSize)malformed("page overflow");return {items,page,pageSize,totalItems,totalPages};}
function lookup<T extends LocaleCode>(payload:unknown,kind:"title"|"character"|"explanation",requestedLocale:T){const r=envelope(payload,true);return {status:"available",requestedLocale,value:detail(r.data,kind)};}
function summaries<T extends LocaleCode>(payload:unknown,q:{page?:number;pageSize?:number},kind:"title"|"character"|"explanation"){return collection(payload,q,(v)=>validateSummary(v,kind));}
function storySpoiler(value:unknown,titleLogicalId:unknown){const r=rec(value,"story spoiler");const level=enumStr(r.level,SPOILERS,"story spoiler level");const scope=nullableString(r.scopeType,"story scope type");const t=uuid(titleLogicalId,"story Title ID");if(scope===undefined)return {level};if(scope==="title")return {level,scope:{type:"full_title",titleId:t}};if(scope==="season")return {level,scope:{type:"season",titleId:t,seasonNumber:integer(r.scopeSeasonNumber,"season number",0)}};return malformed("unresolvable or unapproved story spoiler scope");}
function relationship(value:unknown):Obj {const r=rec(value,"relationship");uuid(r.relationshipId,"relationshipId");const title=titleRef(r.title),a=charRef(r.characterA),b=charRef(r.characterB);enumStr(r.verificationState,VERIFICATIONS,"relationship verification");const states=list(r.history,"relationship history");if(!states.length)malformed("relationship without states");const mapped=states.map(v=>{const state=rec(v,"relationship state");uuid(state.stateId,"state ID");enumStr(state.relationshipType,["romantic","sibling","parent_child","family","friend","enemy","ally","mentor","colleague","former_relationship","unknown_complex"] as const,"relationship type");if(state.canon===undefined)malformed("missing relationship Canon");return {relationshipStateId:state.stateId,sequence:integer(state.sequence,"state sequence",0),relationshipType:state.relationshipType,roleA:state.roleA,roleB:state.roleB,description:state.description,canon:canon(state.canon),spoiler:storySpoiler(state.spoiler,title.logicalId),verificationState:enumStr(state.verificationState,VERIFICATIONS,"relationship state verification")};});return {relationshipId:r.relationshipId,contextTitle:title,characterA:a,characterB:b,summary:r.summary,verificationState:r.verificationState,states:mapped};}
function timeline(value:unknown):Obj {const r=rec(value,"timeline");uuid(r.eventId,"timeline ID");const title=titleRef(r.title);str(r.label,"event label");num(r.chronologyOrder,"chronologyOrder");num(r.presentationOrder,"presentationOrder");enumStr(r.temporalType,["normal","flashback","flash_forward","parallel","time_loop","uncertain"] as const,"temporalType");enumStr(r.verificationState,VERIFICATIONS,"timeline verification");if(r.characters!==undefined)list(r.characters,"characters").forEach(charRef);if(r.canon===undefined)malformed("missing Timeline Canon");return {timelineEventId:r.eventId,title,localizedText:{locale:"en-US",label:r.label,description:r.description},chronologyOrder:r.chronologyOrder,presentationOrder:r.presentationOrder,temporalType:r.temporalType,relativeChronologyLabel:r.relativeChronologyLabel,fictionalDate:r.fictionalDateValue,fictionalDatePrecision:r.fictionalDatePrecision,characters:r.characters,locationLabel:r.locationLabel,canon:canon(r.canon),spoiler:storySpoiler(r.spoiler,title.logicalId),verificationState:r.verificationState};}
function cast<T>(x:unknown):T{return x as T;}
export const screenWhyApiMappers:ApiDomainMappers={
 assertReady:()=>{},
 mapTitleLookup:(p,q)=>cast(lookup(p,"title",q.locale)),
 mapTitleList:(p,q)=>cast(summaries(p,q,"title")),
 mapExplanationLookup:(p,q)=>cast(lookup(p,"explanation",q.locale)),
 mapExplanationList:(p,q)=>cast(summaries(p,q,"explanation")),
 mapCharacterLookup:(p,q)=>cast(lookup(p,"character",q.locale)),
 mapCharacterList:(p,q)=>cast(summaries(p,q,"character")),
 mapSearch:(p,q)=>cast(collection(p,q,v=>{const r=rec(v,"search item");const kind=enumStr(r.kind,["title","explanation","character"] as const,"search kind");return {kind,item:validateSummary(r.summary,kind)};})),
 mapRelationships:(p)=>cast(list(envelope(p,false).data,"relationships").map(relationship)),
 mapTimeline:(p)=>cast(list(envelope(p,false).data,"timeline").map(timeline)),
};
