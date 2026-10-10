import type { ApiMappingOperation } from "@/data/api/mappers";
import type { ApiTransportRequest } from "@/data/api/transport";
import type { LocaleCode } from "@/lib/i18n/locales";
import type { TitleLookupQuery, TitleListQuery, ExplanationLookupQuery, ExplanationListQuery, CharacterLookupQuery, CharacterListQuery, SearchQuery, RelationshipQuery, TimelineQuery } from "@/data/repositories/queries";
import { DataAccessError } from "@/data/errors";

/* Matches ScreenWhy Core REST v1 CoreController/StoryController. Never guess an endpoint. */
function invalid(name: string): never { throw new DataAccessError("malformed_payload", `Invalid ScreenWhy API request: ${name}`, {operation:"build-api-request"}); }
function locale(value: LocaleCode): "en-US" { if (value !== "en-US") invalid("locale"); return "en-US"; }
function slug(value:string):string { if (!/^[a-z0-9-]+$/.test(value)) invalid("slug"); return value; }
function uuid(value:string):string { if (!/^[\da-f]{8}-[\da-f]{4}-[1-8][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(value)) invalid("logical ID"); return value.toLowerCase(); }
function page(query:{page?:number;pageSize?:number}) { const p=query.page??1, s=query.pageSize??20; if(!Number.isInteger(p)||p<1||!Number.isInteger(s)||s<1||s>50) invalid("pagination"); return {page:p,page_size:s}; }
function optionalSearch(value:string|undefined) { if(value===undefined) return undefined; const q=value.trim(); if(!q||new TextEncoder().encode(q).length>160) invalid("search query"); return q; }
function read(path:string, query:Record<string,string|number|readonly string[]|undefined>={}):ApiTransportRequest { return {path,query:{locale:"en-US",...query},options:{method:"GET",cache:"no-store"}}; }
const ready=(_operation:ApiMappingOperation)=>{};

export interface ApiRequestBuilders {
  assertReady(operation:ApiMappingOperation):void;
  buildTitleLookup<T extends LocaleCode>(query:TitleLookupQuery<T>):ApiTransportRequest;
  buildTitleList<T extends LocaleCode>(query:TitleListQuery<T>):ApiTransportRequest;
  buildExplanationLookup<T extends LocaleCode>(query:ExplanationLookupQuery<T>):ApiTransportRequest;
  buildExplanationList<T extends LocaleCode>(query:ExplanationListQuery<T>):ApiTransportRequest;
  buildCharacterLookup<T extends LocaleCode>(query:CharacterLookupQuery<T>):ApiTransportRequest;
  buildCharacterList<T extends LocaleCode>(query:CharacterListQuery<T>):ApiTransportRequest;
  buildSearch<T extends LocaleCode>(query:SearchQuery<T>):ApiTransportRequest;
  buildRelationships(query:RelationshipQuery):ApiTransportRequest;
  buildTimeline(query:TimelineQuery):ApiTransportRequest;
}
export const screenWhyApiRequests:ApiRequestBuilders={
 assertReady:ready,
 buildTitleLookup:q=>{locale(q.locale);return read(`/titles/${slug(q.routeFamily)}/${slug(q.slug)}`);},
 buildTitleList:q=>{locale(q.locale);return read('/titles',{...page(q),route_family:q.routeFamily,q:optionalSearch(q.query),genre:q.genreSlug,country:q.countrySlug,platform:q.platformSlug,release_year:q.releaseYear,sort:q.sort});},
 buildExplanationLookup:q=>{locale(q.locale);return read(`/explanations/${slug(q.slug)}`);},
 buildExplanationList:q=>{locale(q.locale);return read('/explanations',{...page(q),q:optionalSearch(q.query),type:q.explanationType,primary_title_id:q.primaryTitleId?uuid(q.primaryTitleId):undefined,canon:q.canonClassification,route_family:q.routeFamily,sort:q.sort});},
 buildCharacterLookup:q=>{locale(q.locale);return read(`/characters/${slug(q.slug)}`);},
 buildCharacterList:q=>{locale(q.locale);return read('/characters',{...page(q),q:optionalSearch(q.query),title_id:q.titleLogicalId?uuid(q.titleLogicalId):undefined,sort:q.sort});},
 buildSearch:q=>{locale(q.locale);const term=q.query.trim();if(new TextEncoder().encode(term).length>160||term.length<2) invalid('search query');const kinds=q.kinds===undefined?undefined:[...new Set(q.kinds)];if(kinds?.length===0||kinds?.length!==q.kinds?.length||kinds?.some(k=>!['title','explanation','character'].includes(k))) invalid('kinds');return read('/search',{...page(q),q:term,"kind[]":kinds});},
 buildRelationships:q=>{if(!q.titleLogicalId&&!q.characterLogicalId) invalid('relationship context');return read('/relationships',{title_id:q.titleLogicalId?uuid(q.titleLogicalId):undefined,character_id:q.characterLogicalId?uuid(q.characterLogicalId):undefined,...page({pageSize:50})});},
 buildTimeline:q=>read('/timeline',{title_id:uuid(q.titleLogicalId),character_id:q.characterLogicalId?uuid(q.characterLogicalId):undefined,order:q.orderBy,...page({})}),
};
