const mongoose = require('mongoose');
const Lib = require('./models/lib');
const Notation = require('./models/notation');
const User = require('./models/user');
var data = [
    {name: '李志', image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=602501318,2148266890&fm=26&gp=0.jpg'},
    {name: '郑钧', image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598599393849&di=c0a8e5d17ee419a71aea0b16a4e5f58d&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180328%2F35fa4624883746b1a88460ed9ad86193.jpeg'},
    {name: 'AC/DC', image: 'https://www.rollingstone.com/wp-content/uploads/2020/07/acdc-essential-songs.jpg?resize=1800,1200&w=450'},
    {name: 'Chuck Berry', image: 'https://i.guim.co.uk/img/media/3bc4c6a1808c924ae7c92f7f6dfcc7e0d3cb6f72/127_797_5661_3397/master/5661.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=8ac719051e1a40735d841c6fe369156a'}
]

function seedDB(){

    User.remove({},(err)=>{
        if(err){
            console.log(err);
        }
    });
    Notation.remove({},(err)=>{
        if(err){
            console.log(err);
        }
    });
    Lib.remove({}, (err)=>{
        if(err){
            console.log(err);
        }
        /*console.log('removed libs')
        //add libs
        data.forEach((seed)=>{
            Lib.create(seed, (err, lib)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('added a lib');
                    //create a Notation
                    Notation.create(
                        {
                            author:'李志',
                            title: '下雨',
                            images: [
                                'http://www.echangwang.com/up/imgs/1709/1-1F916132316.png'
                            ]
                        }, (err,notation)=>{
                            if(err){
                                console.log('failed to create notation');
                            }else{
                                console.log('created a demo notation');
                                lib.notations.push(notation);
                                lib.save();
                            }
                        }
                    )
                }
            })
        });*/
    })

    
}


module.exports = seedDB;