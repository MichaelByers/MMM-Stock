# MMM-Stock
Stock prices third party module for Magic Mirror

##Installing the Module
Navigate into your MagicMirror's modules folder and execute <br>
`git clone https://github.com/michaelbyers/MMM-Stock.git`
## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
{
    		module: "MMM-Stock",
    		position: "top_left",
    		config: {
    			companies: "MSFT,GOOG,ORCL,FB,AAPL",
                apikey: xxxx
    		}
}
````
Only US companies are accepted.


