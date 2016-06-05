# git2tile

将gitlab上提交的文档自动同步到worktile。

## 配置说明
将config.example.json复制一份，重命名为config.josn。

```
{
    "port":8800,
	"debuglogfilename":"调试日志",
	"tracelogfilename":"express访问日志",
	"errorlogfilename":"错误日志",
    "clientId" : "worktile应用id",
    "clientSecret" : "worktile应用密钥",
    "redirectUrl":"worktile oauth2回调地址",
    "gitlabApi":"http://你gitlab服务器的域名/api/v3",
    "privateKey" : "gitlab调用接口使用的private_key",
    "uploadConfig" : {
        "git@gitlab.ohwit.com:wkt/express-demo.git":{
            "files":["git项目中的文件路径，例如readme.md,src/app.js"],
            "fileType":"doc",
            "worktile":{
                "projectId":"要上传到的项目的项目ID",
                "pageData":{"readme.md":"文档ID"}
            }
        }
    }

}
```
worktile接口调用前需要先得到oauth2的access_token，这对于后台项目来说是比较蹩脚的。
所以，我专门写了一个测试地址`/oauth2/login/worktile`,访问回调成功后，会在控制台上把
oauth2的access_token信息打印出来，将其复制粘贴出来，然后在`src/data/`下新建文件
`oauth_worktile.json`，大体上内容是这样的：
```{"access_token":"access_token的值","expires_in":7776000,"refresh_token":"refresh_token的值"}```

所以上述配置文件上会有`clientId`、`clientSecret`、`redirectUrl`三个值，其实主要作用就是拿到
初始化的`refresh_token`,应用在每次启动时都会使用`refresh_token`来换取一遍新的`access_token`。

接下来就是gitlab端的配置，你可以从`http://你的gitlab域名/profile/account`中得到Private token值，
在这里对应配置项`privateKey`。

`uploadConfig`定义一个gitlab到worktile的同步文件映射关系，其键值为git项目的ssh地址。
具体到子属性，`files`属性为gitlab上要上传的文件路径，写相对于项目的相对路径即可；`worktile`
属性为对应的worktile网站上的项目和文档配置，在worktile面板上选择一个项目，然后选择`文档`
菜单，打开一个你想要同步的文档，这时候地址栏中地址是这个样子的：

`https://worktile.com/project/xxx/page/xxx`
project后面的数字即为项目ID，page后面的即为文档ID。


## 部署说明
将本项目源码部署在服务器上，保证这台服务器可以被gitlab服务器访问到。
假设部署为`1.2.3.4`，你在`config.json`中配置的`port`参数为`8800`。
在gitlab中选择一个项目，在左侧菜单中选择`Settings`->`Web hooks`,然后填入
`http://1.2.3.4:8800/gitlab`，最后保存。

## 文件目录说明
```
doc 文档存放路径
src
----beans
----bin 
--------www 启动文件
----controllers 控制器，接收参数，调用模型，渲染视图
----lib 类库
----modles 模型
----routes 路由，映射控制器
----views 视图
----app.js
----config.js 读取config.json
config.example.json 将其复制一份，并改名config.json
package.json node依赖库等信息
```