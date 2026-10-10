/** 05B behavioural contract checks. Synthetic payloads follow 04E2 PHP ArticleDocumentMapper. */
import { decodeApiArticleBody } from "../src/data/article-body/api-decoder";
import { assertArticleEvidenceIntegrity } from "../src/data/article-body";
import type { PublicArticleContext } from "../src/data/article-body/api-decoder";
import type { PublicCitation } from "../src/types/domain/source";
const ID="123e4567-e89b-42d3-a456-426614174000";
const context:PublicArticleContext={primaryTitleId:ID as never,canon:{classification:"movie_canon",scopes:[{target:{kind:"title",titleId:ID as never}}]}};
const note={kind:"canon_note",classification:"movie_canon",content:[{kind:"text",text:"Film canon is not speculation."}]};
const para={kind:"paragraph",content:[{kind:"text",text:"Loop "},{kind:"text",text:"continues",bold:true,italic:true},{kind:"citation",index:1}]};
const spoiler={kind:"spoiler",level:"major",scopeType:"title",blocks:[{kind:"paragraph",content:[{kind:"text",text:"Protected ending."}]},{kind:"list",ordered:false,items:[[{kind:"text",text:"Hidden clue"}]]}]};
const img={kind:"image",media:{role:"editorial_image",url:"https://cms.screenwhy.com/uploads/triangle.png",alt:"A ship",width:800,height:500}};
const doc={version:"screenwhy_article_v1",intro:[para],sections:[{stableKey:"the-loop",heading:"The Loop",level:2,blocks:[note,spoiler,img,{kind:"divider"}]},{stableKey:"three-jesses",heading:"Three Jesses",level:3,blocks:[{kind:"blockquote",content:[{kind:"text",text:"A quote."}]}]},{stableKey:"masked",heading:"The Mask",level:4,blocks:[{kind:"paragraph",content:[{kind:"text",text:"Read",href:"https://screenwhy.com/movie"},{kind:"text",text:" code",code:true}]}]}]};
const citation:PublicCitation={source:{sourceId:ID as never,sourceType:"primary_screen_work",sourceTitle:"Triangle",verificationState:"approved"},sectionAnchor:"section-the-loop",claimSummary:"An observed event",publicVisibility:true,verificationState:"approved"};
let passed=0;
function check(label:string,ok:boolean){if(!ok)throw new Error(`FAIL ${label}`);passed++;console.log(`PASS 05B ${label}`);}
function deny(label:string,value:unknown,ctx=context){let rejected=false;try{decodeApiArticleBody(value,ctx);}catch(error){rejected=!!error&&typeof error==="object"&&"code" in error&&error.code==="malformed_payload";}check(label,rejected);}
async function main(){
 const article=decodeApiArticleBody(doc,context);
 check("introduction retained",article.intro.length===1);
 check("article H2 preserved",article.sections[0]?.stableKey==="the-loop");
 check("H3 nested under H2",article.sections[0]?.sections?.[0]?.stableKey==="three-jesses");
 check("H4 nested under H3",article.sections[0]?.sections?.[0]?.sections?.[0]?.stableKey==="masked");
 check("citation ordinal remains public 1",article.intro[0]?.kind==="paragraph"&&article.intro[0].content[2]?.kind==="citation"&&article.intro[0].content[2].citationNumber===1);
 check("combined strong+emphasis retained",article.intro[0]?.kind==="paragraph"&&article.intro[0].content[1]?.kind==="styled"&&article.intro[0].content[1].bold===true&&article.intro[0].content[1].italic===true);
 check("Image attachment metadata preserved",article.sections[0]?.blocks[2]?.kind==="image"&&article.sections[0].blocks[2].media.width===800);
 check("Divider preserved",article.sections[0]?.blocks[3]?.kind==="divider");
 check("Canon Note tied to matching verified Canon",article.sections[0]?.blocks[0]?.kind==="canon_note"&&article.sections[0].blocks[0].context.classification==="movie_canon");
 check("Spoiler block decoded",article.sections[0]?.blocks[1]?.kind==="spoiler");
 check("Nested spoiler list preserved",article.sections[0]?.blocks[1]?.kind==="spoiler"&&article.sections[0].blocks[1].blocks[1]?.kind==="list");
 check("Spoiler context tied to Primary Title",article.sections[0]?.blocks[1]?.kind==="spoiler"&&article.sections[0].blocks[1].metadata.screen?.scope?.type==="full_title");
 check("Block quote preserved",article.sections[0]?.sections?.[0]?.blocks[0]?.kind==="blockquote");
 assertArticleEvidenceIntegrity(article,[citation]);check("Resolved verified citation passes",true);
 let mismatch=false;try{assertArticleEvidenceIntegrity(article,[]);}catch{mismatch=true;}check("Unresolved citation is blocked",mismatch);
 let badAnchor=false;try{assertArticleEvidenceIntegrity(article,[{...citation,sectionAnchor:"section-not-there"}]);}catch{badAnchor=true;}check("Incorrect citation anchor blocked",badAnchor);
 deny("Reject unsupported version",{...doc,version:"screenwhy_article_v2"});
 deny("Reject unsupported historical Spoiler scope",{...doc,sections:[{...doc.sections[0],blocks:[{...spoiler,scopeType:"chapter"}]}]});
 deny("Reject mismatched Canon classification",{...doc,sections:[{...doc.sections[0],blocks:[{...note,classification:"interpretation"}]}]});
 deny("Reject duplicate section keys",{...doc,sections:[doc.sections[0],doc.sections[0]]});
 deny("Reject H4 without H3",{...doc,sections:[doc.sections[2]]});
 deny("Reject JavaScript link",{...doc,intro:[{kind:"paragraph",content:[{kind:"text",text:"Click",href:"javascript:alert(1)"}]}]});
 deny("Reject malformed citation ordinal",{...doc,intro:[{kind:"paragraph",content:[{kind:"citation",index:0}]}]});
 deny("Reject raw HTML Gutenberg payload",{version:"screenwhy_article_v1",intro:[{kind:"html",markup:"<script>alert(1)</script>"}],sections:[]});
 deny("Reject unverified image URL",{...doc,intro:[{kind:"image",media:{...img.media,url:"javascript:bad"}}]});
 deny("Reject untrusted media dimensions",{...doc,intro:[{kind:"image",media:{...img.media,width:0}}]});
 const minimal=decodeApiArticleBody({version:"screenwhy_article_v1",intro:[{kind:"paragraph",content:[{kind:"text",text:"Plain."}]}],sections:[]},context);
 check("Plain article compatible",minimal.intro.length===1&&minimal.sections.length===0);
 check("Source data stays untouched",doc.sections[0]?.stableKey==="the-loop"&&doc.intro[0]?.kind==="paragraph");
 console.log(`05B TOTAL ${passed} PASS 0 FAIL`);
}
void main().catch(err=>{console.error(err);process.exitCode=1;});
