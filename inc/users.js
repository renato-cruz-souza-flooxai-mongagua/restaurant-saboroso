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

                        if (results.length === 0) {
                            console.log("NÃO TEM USER");
                            reject("Usuário ou senha incorretos");
                            return;
                        } else {
                           
                            let row = results[0]

                            console.log('EMAIL', email)
                            console.log('password', password)
                            console.log('RESULTS', results)

                            if (password === password[0]){
                                console.log("SENHA INCORRETA")
                                reject("Usuarios ou senha incorretos")
                            } else {
                                resolve(row)
                            }

                        }

                    }

                })

        })

    },

    getUsers(){

        return new Promise((resolve, reject)=>{
    
            conn.query(`
        
                SELECT * FROM tb_users ORDER BY name
                
                `, (err, results) =>{
            
                  if(err) {
                    reject(err)
                  }
                  
                  resolve(results)
            
                }) 
    
        })
    
      },
    
      save(fields, files){
        // console.log("Arquivos recebidos:", files);
        // console.log("Fields Funcionando!!:", fields);
    
        return new Promise((resolve, reject) =>{
    
    
          let query, queryPhoto = '', params = [
            fields.name,
            fields.email
           
        ];
    

    
            if (parseInt(fields.id) > 0) {
    
                params.push(fields.id)            
              
                query = `
            UPDATE tb_users
            SET name = ?,
                email = ?
            WHERE id = ?
        `;
            } else {

                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES(?, ?, ?)
                `;
                params.push(fields.password)
            }
    
    
            conn.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                    console.error("Erro ao inserir ou atualizar no banco:", err);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    delete(id){
    
        return new Promise((resolve, reject) =>{
          
            conn.query(`
                DELETE FROM tb_users WHERE id = ?
                `, [
                    id
                ], (err, results)=>{
    
                   if (err) {
                        reject(err)
                   } else {
                        resolve(results)
                   }
    
                })
        })
    
    },

    changePassword(req){

        return new Promise((resolve, reject)=>{

           if(!req.fields.password) {
                reject("preencha a senha!")
           } else if (req.fields.password !== req.fields.passwordConfirm) {
            reject("corfirme a senha corretamente");
           } else {

            conn.query(`
                    UPDATE tb_users
                    SET password = ?
                    WHERE id = ?
                `,[
                    req.fields.password,
                    req.fields.id

                ], (err, results)=> {

                   if (err) {
                    reject(err.message)
                   } else {
                    resolve(results);
                   }

                })

           }

        })

    }
    
}