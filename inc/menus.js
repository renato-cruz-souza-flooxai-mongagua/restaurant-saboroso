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

    return new Promise((resolve, reject) =>{

      fields.photo = `images/${path.parse(fields.photo.path).base}`;
      console.log("Caminho da foto:", fields.photo.path);

      conn.query(`
          INSERT INTO tb_menus (title, description, price, photo)
          VALUES(?, ?, ?, ?)
        `,[
          fields.title,
          fields.description,
          fields.price,
          fields.photo
        ],(err, results)=>{

          if (err) {
            reject(err)
            console.error("Erro ao inserir no banco:", err);
          } else {
            resolve(results)
          }

        })

    })

  }
}