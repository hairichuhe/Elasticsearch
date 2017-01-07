const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
	host:"127.0.0.1:9200",
	log:"error"
});

const search = function search(index,body){
	return esClient.search({index:index,body:body})
};

const test = function test(){
	let body = {
		size:20,
		from:0,
		query:{
			multi_match:{
				query:"Bradford",
				fields:['title','authors.*name'],
				minimum_should_match:3,
				fuzziness:2
			}
		}
	};

	console.log(`通过匹配${body.query.multi_match.query}接收到数据，每页显示${body.size} 条`);
	search('library',body)
	.then(results => {
		console.log(`在${results.took}毫秒内查询到${results.hits.total}条数据`);
		if (results.hits.total > 0) console.log(`查询出来的数据如下：`);
		results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.title} (score: ${hit._score})`));
	})
	.catch(console.error);
};
test();