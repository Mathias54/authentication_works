/**
 * Created by mathias on 22/08/17.
 */
const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus();

if(cluster.isMaster){

    cpus.forEach( () => {
        cluster.fork();
    });

    cluster.on('online', worker => {
        console.log('cluster %d conectado', worker.process.pid);
    });

    cluster.on('exit', worker => {
        console.log('cluster %d desconectado', worker.process.pid);
        cluster.fork();
    });

    /**
     * TODO falar com o régio sobre a importância da implementação do Clusters.
     */

} else {
    require('./index.js');
}