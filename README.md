# 用 Node.js 和 Elasticsearch 构建搜索引擎
Elasticsearch 是一款开源的搜索引擎，由于其高性能和分布式系统架构而备受关注。本文将讨论其关键特性，并手把手教你如何用它创建 Node.js 搜索引擎。
## Elasticsearch 概述

Elasticsearch 底层使用 Apache Lucene 库，Apache Lucene 自身是一款高性能、基于文本的搜索引擎库。 Elasticsearch 并不以提供数据存储和检索等类数据库功能为核心目标，相反，它以搜索引擎(服务器端)为目标，意在提供数据索引、数据检索、和数据实时分析功能

Elasticsearch 采用分布式架构，因而通过新增节点、或者部署到系统已有节点上即可实现水平扩展。Elasticsearch 可以在 数以百计的服务器上处理 PB级别的数据 。水平扩展同时也意味着高可用性，如果有节点异常，数据可重新被调度执行。

一旦数据导入完成，即可被检索。Elasticsearch 提供无模式、JSON 格式文件存储、数据结构和类型自动检检测等功能。

Elasticsearch 同时采用完全 API 驱动，这意味着：几乎所有的操作都可在 HTTP 上通过使用符合 JSON 数据格式的Restful API 完成。Elasticsearch 提供多种程序语言的客户端 lib，包括 Node.js。

Elasticsearch 对软硬件要求比较灵活。虽然官方建议线上环境采用 64GB 内存，和尽可能多 CPU 系统配置，但其在一个资源受限的系统中依然可以很好地运行（前提是你的数据集不大）。如本文中的示例，2GB 内存，单核 cpu 系统即可。

Elasticsearch 支持主流操作系统，如 Linux、Mac os 和 Windows，只需安装最新版的 Java 运行时环境(参考 Elasticsearch 安装章节)。对于本文中的示例，还需要安装 Node.js (v0.11.0 之后的版本都可) 和 npm 

## Elasticsearch术语
Elasticsearch使用自己的术语，在某些情况下和典型的数据库系统中使用的术语不同。下面列出了Elasticsearch中常用的一些术语及其含义。

索引: 在Elasticsearch环境中，该术语有两个含义。第一个含义是添加数据的操作。当添加数据时，文本会被拆分成分词（token）（例如：单词），每个分词都会被索引。然而，一个索引也指的是所有索引数据的存储位置。通常，当我们导入数据时，数据会被索引成一个index。每次需要对数据执行任何操作时，都必须指定它的索引名。

类型:Elasticsearch在一个索引中对文档提供了更详细的分类，称为类型。一个索引中的每个文档还必须有一个类型。例如，我们可以定义一个图书馆（library）索引，然后再将数据索引成多种类型，比如，文章（article）、书（book）、报告（report）和演示（presentation）。由于索引几乎有固定的开销，所以建议使用较少的索引和较多的类型，而不是较多的索引和较少的类型。

检索: 如字面意思，你可以检索不同的索引和类型数据。Elasticsearch 提供了多种类型的检索关键字，如term、phrase、range、fuzzy，甚至还提供了地理数据的查询词。

过滤: Elasticsearch 支持过滤功能。根据不同的过滤规则过滤检索结果，以便进一步缩小检索结果集。Elasticsearch 依据相关性对文档进行排序。如果你为旧文档新增查询词，可能会触发文档的相关性排序，使得旧文档顺序发生变化。但如果只是新增过滤词，旧文档的顺序保持不变。

聚合: 可在不同类型的聚合数据上展开统计分析，比如minimum, maximum, average, summation, histograms, 等等.

建议: 针对文本输入，Elasticsearch 提供不同的建议类型，这些建议类型可以是一个单词、短语，甚至是完整的语句。 

## 安装Elasticsearch
Elasticsearch 受Apache 2许可证保护，可以被下载，使用，免费修改。安装Elasticsearch 之前你需要先确保在你的电脑上安装了Java Runtime Environment (JRE) ，Elasticsearch 是使用java实现的并且依赖java库运行。你可以使用下面的命令行来检测你是否安装了java

```
java -version
```
推荐使用java最新的稳定版本（写这篇文章的时候是1.8）。你可以在这里找到在你系统上安装java的指导手册。

接下来是下载最新版本的Elasticsearch （写这篇文章的时候是2.3.5），去下载页下载ZIP 文件。Elasticsearch 不需要安装，一个zip文件就包含了可在所有支持的系统上运行的文件。解压下载的文件，就完成了。有几种其他的方式运行Elasticsearch ，比如：获得TAR 文件或者为不同Linux发行版本的包（看这里）。

如果你使用的是Mac操作系统并且安装了Homebrew ，你就可以使用这行命令安装Elasticsearch brew install elasticsearch.Homebrew 会自动添加executables 到你的系统并且安装所需的服务。它也可以使用一行命令帮你更新应用:brew upgrade elasticsearch.

想在Windows上运行Elasticsearch ，可以在解压的文件夹里，通过命令行运行bin\elasticsearch.bat 。对于其他系统，可以从终端运行 ./bin/elasticsearch.这时候，Elasticsearch 就应该可以在你的系统上运行了。

就像我之前提到的，你可以使用Elasticsearch的几乎所有的操作，都可以通过RESTful APIs完成。Elasticsearch 默认使用9200 端口。为了确保你正确的运行了Elasticsearch。在你的浏览器中打开http://localhost:9200/ ，将会显示一些关于你运行的实例的基本信息。

## 图形用户界面
Elasticsearch不须图形用户界面，只通过REST APIs就提供了几乎所有的功能。然而如果我不介绍怎么通过APIs和 Node.js执行所有所需的操作，你可以通过几个提供了索引和数据的可视化信息GUI工具来完成，这些工具甚至含有一些高水平的分析。

Kibana , 是同一家公司开发的工具， 它提供了数据的实时概要，并提供了一些可视化定制和分析选项。Kibana 是免费的。

还有一些是社区开发的工具，如 elasticsearch-head ,  Elasticsearch GUI , 甚至谷歌浏览器的扩展组件 ElasticSearch Toolbox .这些工具可以帮你在浏览器中查看你的索引和数据，甚至可以试运行不同的搜索和汇总查询。所有这些工具提供了安装和使用的攻略。

## 创建一个Node.js环境
弹性搜索为Node.js提供一个官方模块，称为elasticsearch。首先，你需要添加模块到你的工程目录下，并且保存依赖以备以后使用。
```
npm install elasticsearch --save
```
然后，你可以在脚本里导入模块，如下所示：
```
const elasticsearch = require('elasticsearch');
```
最终，你需要创建客户端来处理与弹性搜索的通讯。在这种情况下，我假设你正在运行弹性搜索的本地机器IP地址是127.0.0.1，端口是9200（默认设置）。
```
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
  });
```
日志选项确保所有错误被打印出来。在本篇文章末处，我将使用相同的esClient对象与Elasticsearch进行通讯。这里提供Node模块的复杂文档说明。

注意：这篇导读的所有源代码都可以在GitHub下载查看。最简单的查看方式是在你的PC机上克隆仓库，并且从那里运行示例代码：
```
```