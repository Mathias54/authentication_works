/**
 * Created by mathias on 23/07/17.
 */
//During the test the env variable is set to test

const mongodb = require('../../Express_JWT/configuracoes/mongodbConfigs');
const createPost = require('../../Express_JWT/test');

//Our parent block
describe('mongodb insert test without multiples conections', () => {

    describe('testen de insercao', () => {
        it('inserindo 10000 arquivos', (done) => {

            mongodb( (err, db) => {
                if (err) {
                    callback('Erro interno, tente novamente mais tarde.');
                    return;
                }
                let a = 0;
                for(var i=0; i<1000000; i++){
                    createPost({
                        userid: Math.random(),
                        type: 'post',
                        time: Date.now(),
                        content: 'bla',
                        likes: []
                    }, db, (err, post)=>{
                        // console.log(post.type);
                        a++;
                        if(a === 100){
                            // console.log(a);
                            done();
                        }
                        // console.log(post);
                    });
                }
                // done();
            });
        });
    });
});
