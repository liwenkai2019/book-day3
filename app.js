const express = require('express')
const app = express()
// 设置 默认才用模板引擎名称
app.set('viwes engine', 'ejs')
// 设置模板页面的存放路径
app.set('views', './views')
// 托管
app.use('/node_modules',express.static('./node_modules'))
app.get('/', (req, res) => {
    res.render('index', {})
})
app.listen(80, () => console.log("运行成功。。。"))