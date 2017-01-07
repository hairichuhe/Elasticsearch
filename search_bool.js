// search_bool.js
const elasticsearch = require("elasticsearch");
const esClient = elasticsearch.Client({
	host:"127.0.0.1:9200",
	log:'error'
});

const search = function search(index,body){
	return esClient.search({index:index,body:body})
};

const test = function test(){
	let body = {
		size:20,
		from:0,
		query:{
			bool:{
				must:[]
			}
		}
	}
}