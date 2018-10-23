var mongoose=require('mongoose')
var Schema=mongoose.Schema;

var urlschema=new Schema({
uid:String,
exercise:[]
});
var ModelClass=mongoose.model('extrack',urlschema);
module.exports = ModelClass;