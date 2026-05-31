# 南京大学计算机网络实验文档

## 环境配置

```shell
conda create -n network-exp-docs python=3.12

conda activate network-exp-docs

pip install mkdocs-material jieba
```

## 测试

通过下面的命令在本地启动服务：
```shell
mkdocs serve
```

## 部署

更新仓库：

```shell
git pull
```

构建静态网页：

```shell
mkdocs build --site-dir public
```


