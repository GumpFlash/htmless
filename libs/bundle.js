import fs           from 'fs';
import tmp          from 'tmp';
import watchify     from 'watchify';
import browserify   from 'browserify';

export default async function(file,watch,cb,error){
    tmp.file({ prefix: 'htmless-', postfix: '.js', keep: false}, function (err, path,fd,removeCallback) {
        if (err) error(err);

        var b = browserify({
            entries: [file],
            cache: {},
            packageCache: {},
            plugin: [watchify]
        });
        const bundle = () => {
            b.bundle()
                .on('error', error)
                .pipe(fs.createWriteStream(path))
                .on('finish', () =>{ cb(path)} )
        }
        if(watch) b.on('update', bundle);
        bundle();   
    }); 
}