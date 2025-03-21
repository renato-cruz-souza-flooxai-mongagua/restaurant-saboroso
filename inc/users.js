var conn = require("./db")

module.exports = {

    render(req, res, error){

        res.render("admin/login", {
            body: req.body,
            error
        })

    },

    login(email, password){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users WHERE email = ?
                `, [
                    email
                ],(err, results)=>{

                    if(err) {
                        reject(err)
                    } else {

                        if (!results.length === 0 ){
                            console.log("NÃO TEM USER")
                            reject("Usuarios ou senha incorretos")
                        } else {
                           
                            let row = results[0]

                            console.log('EMAIL', email)
                            console.log('password', password)
                            console.log('RESULTS', results)

                            if (row.password !== password[0]){
                                console.log("SENHA INCORRETA")
                                reject("Usuarios ou senha incorretos")
                            } else {
                                resolve(row)
                            }

                        }

                    }

                })

        })

    }
    
}