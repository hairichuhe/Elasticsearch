//filter.js

const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
	host:"127.0.0.1:9200",
	log:"error"
});

const search = function search(index,body){
	return esClient.search({index:index,body:body});
};

const test = function test(){
	let body = {
		size:20,
		from:0,
		query:{
			bool:{
				must:[
					{
						query_string:{
							query:'(authors.firstname:D* OR authors.lastname:H*) AND (title:excepteur)'
						}
					}
				],
				should:[
					{
						match:{
							body:{
								query: 'Elit nisi fugiat dolore amet',
								type: 'phrase'
							}
						}
					}
				],
				must_not:[
					{
						range: {
							year: {
								lte: 2000,
								gte: 1990
							}
						}
					}
				],
				filter:[
					{
						range:{
							year:{
								gte:2011,
								lte:2015
							}
						}
					}
				]
			}
		}
	};
	console.log(`进行联合查询，每页显示${body.size} 条`);
	search('library',body)
	.then(results => {
		console.log(`在${results.took}毫秒内查询到${results.hits.total}条数据`);
		if (results.hits.total > 0) console.log(`查询出来的数据如下：`);
		results.hits.hits.forEach((hit, index) => console.log(`\t${body.from + ++index} - ${hit._source.title} (score: ${hit._score})`));
	})
	.catch(console.error);
};

test();