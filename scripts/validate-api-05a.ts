/** 05A synthetic DTO tests derived from ScreenWhy Core REST source; NOT live HTTP samples. */
import { createApiRepositories } from "../src/data/api/create-api-repositories";
import { screenWhyApiRequests } from "../src/data/api/requests";
import { screenWhyApiMappers } from "../src/data/api/mappers";
import { DataAccessError } from "../src/data/errors";
import { serializeApiQuery } from "../src/data/api/query";
const ID="123e4567-e89b-42d3-a456-426614174000", VAR="123e4567-e89b-42d3-a456-426614174001";
const identity=(kind:string)=>({kind,logicalId:ID,localization:{requestedLocale:"en-US",primaryLocale:"en-US",currentVariant:{locale:"en-US",publicationState:"published",published:true,variantId:VAR,slug:"triangle"}}});
const verification={state:"approved"};
const seo={canonicalUrl:"https://screenwhy.com/movies/triangle/",index:true};
const reference={logicalId:ID,locale:"en-US",slug:"triangle",displayTitle:"Triangle",publicRouteFamily:"movies"};
const canon={classification:"movie_canon",scopes:[{target:{kind:"title",titleId:ID}}]};
const title={identity:identity("title"),displayTitle:"Triangle",titleType:"movie",publicRouteFamily:"movies",verification,spoilerFreePremise:"A voyage",releaseYear:2009,release:{releaseStatus:"released",releaseYear:2009},classifications:{genres:[],countries:[],originalLanguages:[],platforms:[]},seo};
const explanation={identity:identity("explanation"),articleTitle:"Triangle Explained",explanationType:"ending_explained",primaryTitle:reference,spoiler:{screen:{level:"full"}},canon,verification,dates:{},quickAnswer:"The loop.",editorialStage:"published",publicationState:"published",author:{userId:2,displayName:"Editor"},seo,body:{format:"structured_document",document:{version:"screenwhy_article_v1",intro:[],sections:[]}}};
const character={identity:identity("character"),displayName:"Jess",primaryTitleContext:reference,titleContexts:[reference],verification,seo};
const env=(data:unknown,pagination?:unknown)=>({data,...(pagination?{pagination}:{}),meta:{apiVersion:"1",locale:"en-US"}});
const page={page:1,pageSize:20,totalItems:1,totalPages:1};
let passed=0;
function check(label:string,condition:boolean){if(!condition)throw new Error(`FAIL ${label}`);passed++;console.log(`PASS ${label}`);}
function rejects(label:string,fn:()=>unknown){let hit=false;try{fn();}catch(error){hit=!!error && typeof error==="object" && "code" in error && error.code==="malformed_payload";}check(label,hit);}
async function main(){
 const q={locale:"en-US" as const,routeFamily:"movies" as const,slug:"triangle"};
 const request=screenWhyApiRequests.buildTitleLookup(q);check("canonical Title route",request.path==="/titles/movies/triangle");
 check("GET no-store",request.options?.method==="GET"&&request.options.cache==="no-store");
 const search=screenWhyApiRequests.buildSearch({locale:"en-US",query:"Triangle",kinds:["title","character"]});
 check("PHP array-compatible repeated kind[] query",serializeApiQuery(search.query)==="kind%5B%5D=title&kind%5B%5D=character&locale=en-US&page=1&page_size=20&q=Triangle");
 check("Title list keys",serializeApiQuery(screenWhyApiRequests.buildTitleList({locale:"en-US",routeFamily:"movies",genreSlug:"horror",releaseYear:2009}).query).includes("release_year=2009"));
 check("Explanation list key",serializeApiQuery(screenWhyApiRequests.buildExplanationList({locale:"en-US",explanationType:"ending_explained"}).query).includes("type=ending_explained"));
 check("Character list key",serializeApiQuery(screenWhyApiRequests.buildCharacterList({locale:"en-US",titleLogicalId:ID as never}).query).includes("title_id="));
 check("Relationships context",screenWhyApiRequests.buildRelationships({titleLogicalId:ID as never}).path==="/relationships");
 check("Timeline order",serializeApiQuery(screenWhyApiRequests.buildTimeline({titleLogicalId:ID as never,orderBy:"chronology"}).query).includes("order=chronology"));
 rejects("No orphan relationships query",()=>screenWhyApiRequests.buildRelationships({}));
 rejects("No malformed UUID",()=>screenWhyApiRequests.buildTimeline({titleLogicalId:"forged" as never,orderBy:"chronology"}));
 rejects("Page size maximum",()=>screenWhyApiRequests.buildTitleList({locale:"en-US",pageSize:100}));
 rejects("No duplicate kinds",()=>screenWhyApiRequests.buildSearch({locale:"en-US",query:"Triangle",kinds:["title","title"]}));
 const lookup=screenWhyApiMappers.mapTitleLookup(env(title),q);check("Title detail decoded",lookup.status==="available"&&lookup.value.displayTitle==="Triangle");
 check("Explanation detail decoded",screenWhyApiMappers.mapExplanationLookup(env(explanation),{locale:"en-US",slug:"triangle-explained"}).status==="available");
 check("Character detail decoded",screenWhyApiMappers.mapCharacterLookup(env(character),{locale:"en-US",slug:"jess"}).status==="available");
 check("Title list decoded",screenWhyApiMappers.mapTitleList(env([title],page),{locale:"en-US"}).items.length===1);
 check("Explanation list decoded",screenWhyApiMappers.mapExplanationList(env([explanation],page),{locale:"en-US"}).items.length===1);
 check("Character list decoded",screenWhyApiMappers.mapCharacterList(env([character],page),{locale:"en-US"}).items.length===1);
 check("Search summary converted",screenWhyApiMappers.mapSearch(env([{kind:"title",summary:title}],page),{locale:"en-US",query:"Triangle"}).items[0]?.kind==="title");
 rejects("Wrong REST locale rejected",()=>screenWhyApiMappers.mapTitleLookup(env(title).meta && {...env(title),meta:{apiVersion:"1",locale:"xx-XX"}},q));
 rejects("Wrong version rejected",()=>screenWhyApiMappers.mapTitleLookup({...env(title),meta:{apiVersion:"2",locale:"en-US"}},q));
 rejects("Non-public identity rejected",()=>screenWhyApiMappers.mapTitleLookup(env({...title,identity:{...title.identity,localization:{...title.identity.localization,currentVariant:{...title.identity.localization.currentVariant,publicationState:"draft"}}}}),q));
 rejects("Malformed response rejected",()=>screenWhyApiMappers.mapTitleList({items:[title]}, {locale:"en-US"}));
 rejects("Truncated pagination rejected",()=>screenWhyApiMappers.mapTitleList(env([title],{...page,pageSize:200}),{locale:"en-US"}));
 rejects("No private citation accepted",()=>screenWhyApiMappers.mapExplanationLookup(env({...explanation,citations:[{source:{sourceId:ID,sourceTitle:"Sample",verificationState:"approved"},verificationState:"approved",publicVisibility:false}]}),{locale:"en-US",slug:"x"}));
 const seen:string[]=[];const repo=createApiRepositories({transport:{async request(r){seen.push(r.path);return env(title);}}});
 const actual=await repo.titles.getBySlug(q);check("Transport → mapper → repository",seen[0]==="/titles/movies/triangle"&&actual.status==="available");
 const wrong=createApiRepositories({transport:{async request(){return {secret:"private"};}}});let caught=false;try{await wrong.titles.getBySlug(q);}catch(error){caught=!!error && typeof error==="object" && "code" in error && error.code==="malformed_payload";}check("Malformed transport never falls back to fixtures",caught);
 console.log(`05A TOTAL ${passed} PASS 0 FAIL`);
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
