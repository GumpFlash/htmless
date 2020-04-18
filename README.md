# HTMLess
Use JS without HTML, build your apps only using JS

## How to Use

Install de HTMLess by npm:
```npm install HTMLess```


To use in development:
```htmless run (main file)```

will make an server for you with your changes(any change will reload the page).


To use in production:
```htmless export (main file)```

will make an unique index.html file with all scripts.


## Dependencies
* browserify
* watchify
* esm
* opn
* tmp
* ws