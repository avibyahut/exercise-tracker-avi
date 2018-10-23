// server.js
// where your node app starts

// init project
var express = require('express');
var mongoose=require('mongoose');
var tracker=require('./models/tracker.js');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
mongoose.connect(process.env.dburl);
function cd(d1,d2){
if(d1>d2) return true;
  else return false;
}
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.post('/exercise/new-user',(req,res)=>{
        var name=req.body.username;
  tracker.findOne({uid:name},(err,data)=>{
  if(err) res.send('error reading data');
    else if(data!=null){
      res.send('username exists');
    }
    else {
    var data=new tracker({uid:name,exercise:[]});
   data.save(err=>{
    if(err) res.send('cannot connect to database');
    });
    res.json(data);
    }
  })
         })
app.post('/exercise/add',(req,res)=>{
const id=req.body.uid;
  var ed=[{desc:req.body.desc,dur:Number(req.body.dur),date:new Date(req.body.date)}];
 tracker.findOne({uid:id},(err,data)=>{
   if(data!=null){
   ed=ed.concat(data.exercise);
   data.remove();
     var d=new tracker({uid:id,exercise:ed})
  d.save(err=>{
  if(err) res.send('cannot connect to database');
  });
   res.send('entry added');
   }
   else res.send("invalid userid");
   })
})
app.get('/exercise/log',(req,res)=>{
var id=req.param('userId');
  var sdc=req.param('from');
  var edc=req.param('to');
  var sd=new Date(req.param('from'));
  var ed=new Date(req.param('to'));
  var limit=req.param('limit')
  tracker.findOne({uid:id},(err,data)=>{
  if(!err){
    if(data!=null){
    var x=data.exercise;
      x.sort(function(a,b){
  return new Date(b.date) - new Date(a.date);
});
      var c=0;
    x= x.filter(et=>{
        if(limit==null||(limit!=null&&c<limit)){
          c++;
          if(sdc!=null&&edc!=null) return (et.date<=ed)&&(et.date>=sd);
          else if(sdc!=null) return (sd<=et.date);
          else if(edc!=null) return (et.date<=ed);
          else return true;
        }
        else return true;
      })
   
      res.send(x);
    }
    else res.send("username don't exist")
  }
  })
})
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
