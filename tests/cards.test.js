var assert = require('assert');

suite("Cards", function() {
	test("thing", function(done, server, client) {
		server.eval(function() {
			Cards.find().observe({
				added: function(card) {
					emit('card', card);
				}
			});

		})

		server.once('card', function(card) {
			assert.equal(card.task, 'Do Thing');
			done();
		});

		client.eval(function() {
			Cards.insert({
				task: 'Do Thing',
				status: 0,
				position: 1
			});
		});

	});
})
