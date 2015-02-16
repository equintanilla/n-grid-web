Node server for ngrid code.
Each pathname is considered a key for a particular website 
Thus '/4' is a different page than '/deep/path/4'
There is no persistence layer for the paths but there is an in memory hashmap
that keeps track of the state of that server run.
The web page does a heart beat  every 10 seconds
