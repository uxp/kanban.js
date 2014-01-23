Lists = new Meteor.Collection('lists');

Lists.allow({
	insert: function(userId, doc) {
		return (userId && doc.owner === userId);
	},
	update: function(userId, doc, fields, modifier) {
		return doc.owner === userId;
	},
	remove: function(userId, doc) {
		return doc.owner === userId;
	},
	fetch: ['owner']
});
