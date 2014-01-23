
Meteor.subscribe('cards');
Meteor.subscribe('lists');


function initialSortable() {
	$('.board').sortable({
		plcaeholder: 'ui-state-highlight',
		helper: 'clone',
		update: function(event, ui) {
			console.log('.board update');
			var $this = $(this);
			var lists = $this.sortable('toArray');

			_.each(lists, function(list, index) {
				Lists.update(
					{ _id: list.substring(1) },
					{$set: { order: index + 1 } }
				);
			});
		},
		stop: function(event, ui) {
			initialSortable();
		}
	}).disableSelection();

	$('.sortable ul').sortable({
		connectWith: 'ul',
		dropOnEmpty: true,
		update: function(event, ui) {
			console.log('.card update');
			var $this = $(this);
			var cards = $this.sortable('toArray');
			var _status = $this.attr('id');
			_.each(cards, function(card, index) {
				Cards.update(
					{_id: card},
					{$set: {status: _status, position: index + 1}}
				);
			});
		},
		stop: function(event, ui) {
			var parent = ui.item.parent();
			var id = parent.attr('id');
			$('#'+id).find('li[data-status!='+id+']').remove();
			initialSortable();
		}
	}).disableSelection();
}

Template.board.helpers({
	lists: Lists.find({}, { sort: { order: 1 } })
});

Template.list.cards = function(status) {
	return Cards.find(
		{ status: status },
		{ sort: { position: 1, task: 1 }}
	);
};


Template.board.events = {
	"click .edit": function(event, template) {
		if ($('button').length > 0) {
			event.preventDefault();
		}
		var _id = this._id;
		var task = this.task;
		$('#'+_id).addClass('editing')
		$('#'+_id).html('<textarea>' + task + '</textarea><button class="save">Save</button><button class="delete">Delete</button>');
		$('button.save').on('click', function(_event) {
			var _task = $('#'+_id + ' textarea').val();
			Cards.update({_id: _id}, { $set: { task: _task } });
			$('#' + _id ).html(_task + "<a class='edit' href='#'><span class='ui-icon ui-icon-pencil'></span></a>");
			$('#'+_id).removeClass('editing')
			return _event.preventDefault();
		});
		$('button.delete').on('click', function(_event) {
			Cards.remove(_id, function(){
				console.log('removing');
			});
		});
		return event.preventDefault();
	},
	"click .add": function(event, template) {
		if ($('button').length > 0) {
			event.preventDefault();
		}

		var li_wrapper = $(event.target).parent();
		var status = li_wrapper.parent().attr('id');
		li_wrapper.addClass('card ui-state-default editing')
		li_wrapper.html('<textarea></textarea><button class="save">Save</button><button class="delete">Delete</button>');
		$('button').on('click', function(_event) {
			var _task = $('textarea').val();
			var _status = status;
			var length = Cards.find({ status: _status }).count();
			if ($.trim(_task).length !== 0) {
				Cards.insert({
					task: _task,
					status: _status,
					position: length + 1,
					owner: Meteor.userId()
				});
			}
			li_wrapper.removeClass('card ui-state-default editing');
			li_wrapper.html('<a class="add" href="#">Add Card</a>');
			_event.preventDefault();
		});
	},
	"click .add_list": function(event, template) {
		if ($('button').length > 0) {
			event.preventDefault();
		}

		var li_wrapper = $(event.target).parent();
		li_wrapper.addClass('ui-state-default');
		li_wrapper.html('<textarea></textarea><button>Save</button>');
		$('button').on('click', function(_event) {
			var liName = $('textarea').val();
			var length = Lists.find().count();
			if ($.trim(liName).length !== 0) {
				Lists.insert({
					name: liName,
					order: length + 1,
					owner: Meteor.userId()
				});
			}
			li_wrapper.removeClass('ui-state-default');
			li_wrapper.html('<a class="add_list" href="#">Add List</a>');
			_event.preventDefault();
		});
	}
};

Meteor.startup(function() {
	initialSortable();
/*
	Lists.remove({})
	if ((Lists.find({}).count() === 0) && Meteor.userId()) {
		Lists.insert({
			name: 'Pending',
			order: 1,
			owner: Meteor.userId()
		});
		Lists.insert({
			name: 'Doing',
			order: 2,
			owner: Meteor.userId()
		});
		Lists.insert({
			name: 'Completed',
			order: 3,
			owner: Meteor.userId()
		});
	}
*/
})

