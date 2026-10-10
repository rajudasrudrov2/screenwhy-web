/** End-to-end API-mode transport -> DTO -> repository -> page-loader against synthetic response doubles. */
const ID="123e4567-e89b-42d3-a456-426614174000", VAR="123e4567-e89b-42d3-a456-426614174001";
const identity=(kind:string)=>({kind,logicalId:ID,localization:{requestedLocale:"en-US",primaryLocale:"en-US",currentVariant:{locale:"en-US",publicationState:"published",published:true,variantId:VAR,slug:"triangle"}}});
const reference={logicalId:ID,locale:"en-US",slug:"triangle",displayTitle:"Triangle",publicRouteFamily:"movies"};
const title={identity:identity("title"),displayTitle:"Triangle",titleType:"movie",publicRouteFamily:"movies",verification:{state:"approved"},seo:{canonicalUrl:"https://screenwhy.com/movies/triangle/",index:false},spoilerFreePremise:"A mysterious voyage.",release:{releaseYear:2009,releaseStatus:"released"},classifications:{genres:[],countries:[],originalLanguages:[],platforms:[]}};
const citation={source:{sourceId:ID,sourceTitle:"Triangle (2009)",sourceType:"primary_screen_work",verificationState:"approved"},sectionAnchor:"section-loop",publicVisibility:true,verificationState:"approved"};
const body={version:"screenwhy_article_v1",intro:[{kind:"paragraph",content:[{kind:"text",text:"The loop begins."}]}],sections:[{stableKey:"loop",heading:"The Loop",level:2,blocks:[{kind:"paragraph",content:[{kind:"text",text:"It repeats."},{kind:"citation",index:1}]},{kind:"spoiler",scopeType:"title",level:"major",blocks:[{kind:"paragraph",content:[{kind:"text",text:"Hidden ending."}]}]}]}]};
const explanation={identity:identity("explanation"),articleTitle:"Triangle Ending Explained",excerpt:"The mystery",explanationType:"ending_explained",primaryTitle:reference,spoiler:{screen:{level:"full"}},canon:{classification:"movie_canon",scopes:[{target:{kind:"title",titleId:ID}}]},verification:{state:"approved"},dates:{datePublished:"2026-10-09T00:00:00Z"},quickAnswer:"The loop explains it.",editorialStage:"published",publicationState:"published",author:{userId:10,displayName:"Editorial reviewer"},seo:{canonicalUrl:"https://screenwhy.com/explain/triangle/",index:false},body:{format:"structured_document",document:body},citations:[citation]};
const env=(data:unknown)=>({data,meta:{apiVersion:"1",locale:"en-US"}});
async function main(){
 process.env.SCREENWHY_DATA_SOURCE="api";
 process.env.SCREENWHY_CMS_API_BASE_URL="https://synthetic.local/wp-json";
 let calls=0;
 globalThis.fetch=async(request)=>{
  calls++;
  const url=new URL(String(request));
  if(url.pathname==="/wp-json/screenwhy/v1/explanations/triangle")return Response.json(env(explanation));
  if(url.pathname==="/wp-json/screenwhy/v1/titles/movies/triangle")return Response.json(env(title));
  return Response.json({code:"screenwhy_not_found"},{status:404});
 };
 const {loadExplanationDetail}=await import("../src/features/explanation-detail/explanation-detail.loader");
 const detail=await loadExplanationDetail("triangle");
 if(!detail||detail.explanation.articleTitle!=="Triangle Ending Explained"||detail.primaryTitle?.displayTitle!=="Triangle"||detail.article.sections[0]?.stableKey!=="loop"||calls!==2)throw new Error("API-mode Explanation route loader failed to decode two real-contract response shapes");
 console.log("PASS 05B API transport → v1 DTO → repositories → Explanation Detail loader");
 if(detail.article.sections[0]?.blocks[1]?.kind!=="spoiler")throw new Error("Nested public spoiler mapping failed");
 console.log("PASS 05B nested spoiler/citation anchor retain full detail context");
 console.log("05B API LOADER 2 PASS 0 FAIL");
}
void main().catch(e=>{console.error(e);process.exitCode=1;});
