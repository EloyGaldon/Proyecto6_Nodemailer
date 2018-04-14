let conn= require ('.././connections/mysqlconnection');
let hash= require('bcrypt-nodejs');
let Users= {};

Users.signUp = (usuario,cb)=>{
    let comprobacion = [1,2,3];
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query("SELECT * FROM cliente WHERE nombre=?",usuario.nombre,function (err1,res1) {
        if (err1) return cb(err1);
        if (res1 != ''){
            return cb(null,comprobacion[0]);
        } else {
            conn.query('SELECT * FROM cliente where email=?',usuario.email,function (err2,res2) {
                if (err2) return cb(err2);
                if (res2 != '' ){
                    return cb(null,comprobacion[1]);
                }else {
                    conn.query('INSERT INTO cliente SET ?',usuario,function (err3,res3) {
                        if(err3) return cb(err3);
                        return cb(null,comprobacion[2]);
                    })
                }
            })
        }
    })
};

Users.login = (usuario,cb)=>{
    let comprobacion = [1,2,3];
    if (!conn) return cb("No se ha podido crear la conexion")
    conn.query('SELECT * FROM cliente WHERE email=?',[usuario.email],function (err,rows) {
        if (err) return cb(error);
        if (rows == ''){
            return cb(null,comprobacion[0]);
        } else {
            hash.compare(usuario.password, rows[0].hash, function(err, coincide) {
                console.log(coincide);
                if (!coincide){
                    return cb(null,comprobacion[1]);
                }else{
                    return cb(null,comprobacion[2],rows[0]);
                }
            });
        }
    })
};

Users.getAllUsers = (cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('SELECT * FROM cliente',function (err,usuarios) {
        if (err) return cb(err);
        //console.log(destinos);
        return cb(err,usuarios);
    })
};

Users.activaUser=(id,cb)=> {
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query("SELECT * FROM cliente WHERE id=?", id, function (error, resultado) {
        if (error) return cb(error);
        else {
            let valorActivo = resultado[0].active;
            if (valorActivo == 1)
                valorActivo = 0;
            else
                valorActivo = 1;
            conn.query("Update cliente set active=" + valorActivo + " where id=?", id, function (error, resultado) {
                if (error) return cb(error);
                return cb(null, resultado);
            })
        }
    })
};

Users.darPermisos=(id,cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query("SELECT * FROM cliente WHERE id=?", id, function (error, resultado) {
        if (error) return cb(error);
        else {
            let admin=resultado[0].isAdmin;
            if(admin==1){
                admin=0;
            }
            else{
                admin=1;
            }
            conn.query("Update cliente set isADmin=" + admin + " where id=?", id, function (error, resultado) {
                if (error) return cb(error);
                return cb(null, resultado);
            })
        }
    })
}

Users.createUser = (usuario,cb) =>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('INSERT INTO cliente SET ?',usuario,function (err,res) {
        if (err) return cb(err);
        return cb(err,res);
    })
};


Users.deleteUser=(id,cb)=>{
    //console.log('Entro en modelo');
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('DELETE FROM cliente WHERE id=?',id,function (err,res) {
        if (err) return cb(err);
        return cb(err, res);
    })
}

Users.recovery=(email,cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('SELECT * from cliente where email=?',email,function(err,res){
        if (err) return cb(err);
        else return cb(null,res);
    })
}

Users.recover=(hash,cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('SELECT * from cliente where hash=?',hash,function(err,res){
        if (err) return cb(err);
        else return cb(null,res);
    })
}

Users.recoverPass=(usuario,cb)=>{
    if (!conn) return cb("No se ha podido crear la conexion");
    conn.query('Update cliente set ? where id='+usuario.id+'',usuario,function(err,res){
        if (err) return cb(err);
        else {
            console.log('error');
        }
    })
}
module.exports = Users;


