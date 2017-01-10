// aggregations.js

const elasticsearch = require("elasticsearch");
const esClient = new elasticsearch.Client({
	host:"127.0.0.1:9200",
	log:"error"
});

const search = function search (index,body){
	return esClient.search({index:index,body:body})
};

const test = function test(){
	let body = {
		size:0,
		from:0,
		query:{
			match_all:{}
		},
		aggregations:{
			min_year:{
				min:{field:"year"}
			},
			max_year:{
				max:{field:"year"}
			},
			year_percentile:{
				percentiles:{field:"year"}
			},
			year_histogram:{
				histogram:{field:"year",interval:5}
			}/*,
			keywords:{
				terms:{
					field:"keywords",
					size:20
				}
			}*/
		}
	};
	console.log(`进行聚合查询，每页显示${body.size} 条数据)`);
	search('library', body)
	.then(results => {
		console.log(`耗时${results.took}ms`);
		
		console.log(`\n最老的数据在 ${results.aggregations.min_year.value}`);
		
		console.log(`\n最新的文章放在 ${results.aggregations.max_year.value}`);

		console.log(`\n数据以5年为一组放置`);
		results.aggregations.year_histogram.buckets.forEach(bucket => console.log(`\tnumber of articles published in ${bucket.key}-${bucket.key + 4}: ${'#'.repeat(bucket.doc_count/5)} (${bucket.doc_count})`));

		console.log(`\npercentile of articles published in different years:`);
		console.log(`\t1% of articles are published on or before ${results.aggregations.year_percentile.values['1.0']}`);
		console.log(`\t5% of articles are published on or before ${results.aggregations.year_percentile.values['5.0']}`);
		console.log(`\t25% of articles are published on or before ${results.aggregations.year_percentile.values['25.0']}`);
		console.log(`\t50% of articles are published on or before ${results.aggregations.year_percentile.values['50.0']}`);
		console.log(`\t75% of articles are published on or before ${results.aggregations.year_percentile.values['75.0']}`);
		console.log(`\t95% of articles are published on or before ${results.aggregations.year_percentile.values['95.0']}`);
		console.log(`\t99% of articles are published on or before ${results.aggregations.year_percentile.values['99.0']}`);

		console.log(`\ntop ${results.aggregations.keywords.buckets.length} article tags:`);
		results.aggregations.keywords.buckets.forEach((bucket, index) => console.log(`\t${++index} ${bucket.key}: ${bucket.doc_count}`));
	})
	.catch(console.error);
};
test();