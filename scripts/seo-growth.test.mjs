import test from "node:test";
import assert from "node:assert/strict";
import {changedUrls} from "../app/lib/indexNowDiff.ts";
import {seoTopics,matchingTopicLinks,topicHref} from "../app/lib/seoTopics.ts";
import {seoArticles,articleHref} from "../app/lib/seoArticles.ts";

test("IndexNow sends added, changed and removed URLs, not unchanged URLs",()=>{
  assert.deepEqual(changedUrls({a:"1",b:"1",c:"1"},{a:"1",b:"2",d:"1"}),["b","c","d"]);
  assert.deepEqual(changedUrls({a:"1"},{a:"1"}),[]);
  assert.deepEqual(changedUrls({},{"https://td-fahrzeugcodierung.de/codieranleitungen/dokument?produkt=abc%20def":"1"}),["https://td-fahrzeugcodierung.de/codieranleitungen/dokument?produkt=abc%20def"]);
});
test("Topic filters only matching published entries and does not invent products",()=>{
 const links=[{title:"Golf 7 Lane Assist",href:"/a"},{title:"Golf 7 Light Assist",href:"/b"},{title:"AHK Audi A4",href:"/c"}];
 assert.deepEqual(matchingTopicLinks(seoTopics.find(t=>t.slug==="lane-assist"),links).map(l=>l.href),["/a"]);
 assert.deepEqual(matchingTopicLinks(seoTopics.find(t=>t.slug==="fernlichtassistent"),links).map(l=>l.href),["/b"]);
 assert.deepEqual(matchingTopicLinks(seoTopics.find(t=>t.slug==="ahk"),links).map(l=>l.href),["/c"]);
});
test("Topic and article URLs are unique and articles point to registered topics",()=>{
 const urls=[...seoTopics.map(t=>topicHref(t.slug)),...seoArticles.map(a=>articleHref(a.slug))];
 assert.equal(urls.length,16);
 assert.equal(new Set(urls).size,urls.length);
 for(const a of seoArticles)assert.ok(seoTopics.some(t=>t.slug===a.topic));
});
