//search_match.js

const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
	host:'127.0.0.1:9200',
	log:'error'
});

const search = function search(index, body){
	return esClient.search({index: index,body:body});
};

const test = function test(){
	let body={
		size:20,
		from:0,
		query:{
			match:{
				title:{
					query:'Quist partiatur',
					minimum_should_match:3,
					fuzziness:2
				}
			}
		}
	};

	console.log(`以'${body.query.match.title.query}'为条件查询文档并每页显示${body.size}`);
	search('library', body)
	.then(results => {
		console.log(`在${results.took}毫秒内查询到${results.hits.total}条数据`);
		if (results.hits.total > 0) console.log(`查询出来的数据如下：`);
		results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.title} (score: ${hit._score})`));
	})
	.catch(console.error);
};
test();