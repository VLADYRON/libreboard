Template.lists.rendered = function() {
    var _this = this,
        data = this.data,
        lists = _this.$(".lists");

    if (!data.board.edit('yes')) {
        lists.sortable({
            connectWith: ".lists",
            handle: ".list-header",
            tolerance: 'pointer',
            appendTo: 'body',
            helper: "clone",
            items: '.list:not(.add-list)',
            placeholder: 'list placeholder',
            start: function (event, ui) {
                $('.list.placeholder').height(ui.item.height());
            },
            stop: function(event, ui) {
                lists.find('.list:not(.add-list)').each(function(i, list) {
                    var data = Blaze.getData(list);
                    Lists.update(data._id, { 
                        $set: {
                            sort: i
                        } 
                    });
                });
            }
        }).disableSelection();
    } 


    // update height add, update, remove resize board height.
    Lists.find().observe({
        added: Utils.resizeHeight('.board-canvas'),
        updated: Utils.resizeHeight('.board-canvas'),
        removed: Utils.resizeHeight('.board-canvas')
    });
};

Template.addlistForm.helpers({});
Template.lists.helpers({});

Template.lists.events({
    'click .js-open-card-composer': function(event, t) {
        var $el = $(event.currentTarget),
            list = $el.parents('.list'),
            composer = list.find('.card-composer');
            allComposers = t.$('.card-composer');

        // all lists hide composer and open click composer show
        allComposers.addClass('hide');
        t.$('.js-open-card-composer').removeClass('hide');

        // click open composer and focus 
        composer.removeClass('hide');
        composer.find('.js-card-title').focus();
        $el.addClass('hide');
    },
    'click .js-open-list-menu': function(event, t) {
        var $this = $(event.currentTarget),
            list = $this.parents('.list');

        // open pop
        Utils.Pop.open('listActionPop', 'List Actions', list[0], this);
        event.preventDefault();
    },
    'click .hide-on-edit': function(event, t) {
        var $this = $(event.currentTarget),
            listHeader = $this.parents('.list-header');

        // remove all editing classes
        $('.js-list-header').removeClass('editing');

        // and current editing open.
        listHeader.addClass('editing');

        // focus current form title
        listHeader.find('.single-line').focus();
    }
});

Template.listTitleEditForm.events({
    'submit #ListTitleEditForm': function(event, t) {
        var title = t.find('.js-title-input').value;
        if ($.trim(title)) {
            Lists.update(this.list._id, {
                $set: {
                    title: title
                }
            });

            // all editing remove
            $('.js-list-header').removeClass('editing');
        }
        event.preventDefault();
    },
    'click .js-cancel-edit': function(event, t) {
        $('.js-list-header').removeClass('editing');
    }
});

Template.addlistForm.events({
    'click .js-open-add-list': function(event, t) {
        t.$('.list').removeClass('idle');
        t.$('.list-name-input').focus();
    },
    'click .js-cancel-edit': function(event, t) {
        t.$('.list').addClass('idle');
    },
    'submit #AddListForm': function(event, t) {
        var title = t.find('.list-name-input');
        if ($.trim(title.value)) {
            // insert 
            Lists.insert({ 
                title: title.value, 
                boardId: this.board._id,
                sort: $('.list').length
            }, function() {

                // insert complete to scrollLeft
                Utils.Scroll('#board').left(270, true);
            });

            // clear input 
            title.value = '';
        }
        event.preventDefault();
    }
});

Template.listActionPop.events({
    'click .js-close-list': function(event, t) {
        Lists.update(this._id, { 
            $set: {
                closed: true
            }
        }, function(err, listId) {
            // close pop
            Utils.Pop.close();
        }); 
        event.preventDefault();    
    },
    'click .js-add-card': function(event, t) {},
    'click .js-list-subscribe': function(event, t) {}
});
