import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import localEditor from './integration.mjs';

async function app(t, generate) {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'editor-http-'));
	const ko = path.join(root, 'src/content/blog/ko/demo.md');
	await fs.mkdir(path.dirname(ko), { recursive: true });
	await fs.writeFile(ko, "---\ntitle: '제목'\ndescription: '요약'\npubDate: 2026-10-31\n---\n\n본문\n");
	const handlers = new Map();
	const plugin = localEditor({ generate });
	plugin.hooks['astro:config:setup']({command:'dev', config:{root:pathToFileURL(root + '/')}, injectRoute() {}});
	plugin.hooks['astro:server:setup']({server:{middlewares:{use(route, handler) {handlers.set(route, handler);}}}});
	const server = http.createServer((req,res) => {
		const route = new URL(req.url, 'http://localhost').pathname;
		const handler = handlers.get(route);
		if (handler) handler(req,res);
		else {res.statusCode=404;res.end();}
	});
	await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
	t.after(async()=>{
		await new Promise(resolve=>server.close(resolve));
		await fs.rm(root,{recursive:true,force:true});
	});
	return {root,ko,url:`http://127.0.0.1:${server.address().port}`};
}

const generate = async ({ body }) => ({title:'Title', description:'Summary', body:body.replace('본문','Body')});

test('translation endpoint creates English and returns its preview link', async t => {
	const {root,url} = await app(t,generate);
	const res = await fetch(url + '/__editor/translate?lang=ko&slug=demo', {method:'POST', headers:{'Content-Type':'application/json'},body:'{}'});
	assert.equal(res.status,200);
	assert.equal((await res.json()).url,'/en/blog/demo/');
	assert.match(await fs.readFile(path.join(root,'src/content/blog/en/demo.md'),'utf8'),/\nBody\n/);
});

test('translation endpoint rejects unsupported methods, cross-origin requests, and invalid input', async t => {
	let calls = 0;
	const {url} = await app(t,async input=>{calls++;return generate(input);});
	const cases = [
		{method:'GET',query:'lang=ko&slug=demo',headers:{},want:405},
		{method:'POST',query:'lang=ko&slug=demo',headers:{'Content-Type':'text/plain'},body:'{}',want:415},
		{method:'POST',query:'lang=ko&slug=demo',headers:{'Content-Type':'application/json',Origin:'https://other.example'},body:'{}',want:403},
		{method:'POST',query:'lang=en&slug=demo',headers:{'Content-Type':'application/json'},body:'{}',want:400},
		{method:'POST',query:'lang=ko&slug=../demo',headers:{'Content-Type':'application/json'},body:'{}',want:400},
		{method:'POST',query:'lang=ko&slug=demo',headers:{'Content-Type':'application/json'},body:'{',want:400},
	];
	for (const {query,want,...options} of cases) {
		const res=await fetch(url+'/__editor/translate?'+query,options);
		assert.equal(res.status,want,query+' '+options.method);
	}
	assert.equal(calls,0);
});

test('ordinary save preserves unedited Markdown and never invokes translation', async t => {
	let calls=0;
	const {url,ko}=await app(t,async input=>{calls++;return generate(input);});
	const res=await fetch(url+'/__editor/post?lang=ko&slug=demo',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'수정 제목'})});
	assert.equal(res.status,200);
	assert.equal(calls,0);
	const raw=await fs.readFile(ko,'utf8');
	assert.match(raw,/title: '수정 제목'/);
	assert.ok(raw.endsWith('\n\n본문\n'));
});

test('creating a new post still writes a draft with correctly quoted metadata', async t => {
	const {url,root}=await app(t,generate);
	const res=await fetch(url+'/__editor/post?lang=ko&slug=new-post',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:"It's a new post"})});
	assert.equal(res.status,201);
	const raw=await fs.readFile(path.join(root,'src/content/blog/ko/new-post.md'),'utf8');
	assert.match(raw,/title: 'It''s a new post'/);
	assert.match(raw,/pubDate: \d{4}-\d{2}-\d{2}/);
	assert.match(raw,/draft: true/);
});

test('static builds do not register editor routes', () => {
	const routes=[];
	localEditor().hooks['astro:config:setup']({command:'build',config:{},injectRoute:route=>routes.push(route)});
	assert.deepEqual(routes,[]);
});
