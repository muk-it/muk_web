# MuK Web Client

Extends the Odoo web client to include
bus channels. Channels can be created to listen to Odoo bus
notifications. To add a channel listener to the client just
extend the web client and declare a new bus channel.

### Example

```javascript
var WebClient = require('web.WebClient');
var session = require('web.session');	

WebClient.include({
	show_application: function() {
		var channel = session.db + '_mychannel';
        this.bus_declare_channel(channel, this.doSomething);
        return this._super();
    },
	doSomething: function(message) {
		...
	}
});
```