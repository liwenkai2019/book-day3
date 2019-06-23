const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const moment = require('moment')

const conn = mysql.createConnection({
    host: '127.0.0.1',
    database: 'mysql-001',
    user: 'root',
    password: 'root'
})
// 设置 默认才用模板引擎名称
app.set('viwes engine', 'ejs')
// 设置模板页面的存放路径
app.set('views', './views')
// 托管
app.use('/node_modules', express.static('./node_modules'))
// 注册解析表单数据的中间件
app.use(bodyParser.urlencoded({
    extended: false
}))
app.get('/', (req, res) => {
    res.render('index.ejs', {})
})
// 用户请求的是注册页面的时候
app.get('/register', (req, res) => {
    // 注意 当在调用引擎模板的 res.render方法的时候 ./相对的路径是
    res.render('./user/register.ejs', {})
})
// 用户请求的是登录页面的时候
app.get('/login', (req, res) => {
    // 注意 当在调用引擎模板的 res.render
    res.render('./user/login.ejs', {})
})
app.post('/register', (req, res) => {
    // 完成用户注册的业务逻辑
    // 1.接受前端发送的POST请求
    // 2.对前端发送的桉树进行解析
    // 3.对擦书进行校验,合法性,是否重复
    // 4.往数据库添加用户
    const body = req.body
    // 判断用户输入的数据是否完整
    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        return res.send({
            msg: '请填写完整的表单数据后再注册用户！',
            status: 501
        })
    }
    // 链接数据库
    const sql1 = 'select count(*) as count from book where username=?'
    // 查重
    conn.query(sql1, body.username, (err, result) => {
        // 如果查询失败，则告知客户端失败
        if (err) return res.send({
            msg: '用户名查重失败！',
            status: 502
        })

        if (result[0].count !== 0) return res.send({
            msg: '请更换其它用户名后重新注册！',
            status: 503
        })
        // 执行注册的业务逻辑
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
        const sql2 = 'insert into book set ?'
        conn.query(sql2, body, (err, result) => {
            if (err) return res.send({
              msg: '注册新用户失败！',
              status: 504
            })
            if (result.affectedRows !== 1) return res.send({
              msg: '注册新用户失败！',
              status: 505
            })
            res.send({
              msg: '注册新用户成功！',
              status: 200
            })
          })
    })

})
app.listen(3000, () => console.log("运行成功。。。"))