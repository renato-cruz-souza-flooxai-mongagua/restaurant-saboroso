const { rejects } = require('assert')
let conn = require('./db')
let path = require('path')

module.exports = {
  getMenus(){

    return new Promise((resolve, reject)=>{

        conn.query(`
    
            SELECT * FROM tb_menus ORDER BY title
            
            `, (err, results) =>{
        
              if(err) {
                reject(err)
              }
              
              resolve(results)
        
            }) 

    })

  },

  save(fields, files){
    console.log("Arquivos recebidos:", files);
    console.log("Fields Funcionando!!:", fields);

    return new Promise((resolve, reject) =>{

      fields.photo = `images/${path.parse(files.photo[0].filepath).base}`;

      let query, queryPhoto = '', params = [
        fields.title,
        fields.description,
        fields.price
    ];

        if(files.photo?.[0]?.filepath){

            queryPhoto = `, photo = ?`;

            params.push(fields.photo);
        }

        if (parseInt(fields.id) > 0) {

            params.push(fields.id)            
          
            query = `
        UPDATE tb_menus
        SET title = ?,
            description = ?,
            price = ?
            ${queryPhoto}
        WHERE id = ?
    `;
        } else {

            if (files.photo?.[0]?.filepath) {
               return reject('Envie a foto do prato!')
            }

            query = `
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES(?, ?, ?, ?)
            `;
        }

        console.log("Caminho da foto:", fields.photo);

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
            DELETE FROM tb_menus WHERE id = ?
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

}

}