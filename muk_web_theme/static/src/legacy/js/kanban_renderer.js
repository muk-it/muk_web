/**********************************************************************************
*
*    Copyright (c) 2017-today MuK IT GmbH.
*
*    This file is part of MuK Theme
*    (see https://mukit.at).
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Lesser General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Lesser General Public License for more details.
*
*    You should have received a copy of the GNU Lesser General Public License
*    along with this program. If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

odoo.define('muk_web_theme.KanbanRenderer', function (require) {
"use strict";

const config = require('web.config');
const core = require('web.core');

const KanbanRenderer = require('web.KanbanRenderer');

const _t = core._t;
const qweb = core.qweb;

if (!config.device.isMobile) {
    return;
}

KanbanRenderer.include({
    custom_events: _.extend({}, KanbanRenderer.prototype.custom_events || {}, {
        quick_create_column_created: '_onColumnAdded',
    }),
    events: _.extend({}, KanbanRenderer.prototype.events, {
        'click .o_kanban_mobile_tab': '_onMobileTabClicked',
        'click .o_kanban_mobile_add_column': '_onMobileQuickCreateClicked',
    }),
    ANIMATE: true,
    init() {
        this._super.apply(this, arguments);
        this.activeColumnIndex = 0;
        this._scrollPosition = null;
    },
    on_attach_callback() {
        if (this._scrollPosition && this.state.groupedBy.length && this.widgets.length) {
            var $column = this.widgets[this.activeColumnIndex].$el;
            $column.scrollLeft(this._scrollPosition.left);
            $column.scrollTop(this._scrollPosition.top);
        }
        this._computeTabPosition();
        this._super.apply(this, arguments);
    },
    on_detach_callback() {
        if (this.state.groupedBy.length && this.widgets.length) {
            var $column = this.widgets[this.activeColumnIndex].$el;
            this._scrollPosition = {
                left: $column.scrollLeft(),
                top: $column.scrollTop(),
            };
        } else {
            this._scrollPosition = null;
        }
        this._super.apply(this, arguments);
    },
    addQuickCreate() {
        if(this._canCreateColumn() && !this.quickCreate.folded) {
            this._onMobileQuickCreateClicked();
        }
        return this.widgets[this.activeColumnIndex].addQuickCreate();
    },
    updateColumn(localID) {
        var index = _.findIndex(this.widgets, {db_id: localID});
        var $column = this.widgets[index].$el;
        var scrollTop = $column.scrollTop();
        return this._super.apply(this, arguments)
            .then(() => this._layoutUpdate(false))
            .then(() => $column.scrollTop(scrollTop));
    },
    _canCreateColumn: function() {
        return this.quickCreateEnabled && this.quickCreate && this.widgets.length;
    },
    _computeColumnPosition(animate) {
        if (this.widgets.length) {
            const rtl = _t.database.parameters.direction === 'rtl';
            this.$('.o_kanban_group').show();
            const $columnAfter = this._toNode(this.widgets.filter((widget, index) => index > this.activeColumnIndex));
            const promiseAfter = this._updateColumnCss($columnAfter, rtl ? {right: '100%'} : {left: '100%'}, animate);
            const $columnBefore = this._toNode(this.widgets.filter((widget, index) => index < this.activeColumnIndex));
            const promiseBefore = this._updateColumnCss($columnBefore, rtl ? {right: '-100%'} : {left: '-100%'}, animate);
            const $columnCurrent = this._toNode(this.widgets.filter((widget, index) => index === this.activeColumnIndex));
            const promiseCurrent = this._updateColumnCss($columnCurrent, rtl ? {right: '0%'} : {left: '0%'}, animate);
            promiseAfter
                .then(promiseBefore)
                .then(promiseCurrent)
                .then(() => {
                    $columnAfter.hide();
                    $columnBefore.hide();
                });
        }
    },
    _computeCurrentColumn() {
        if (this.widgets.length) {
            var column = this.widgets[this.activeColumnIndex];
            if (!column) {
                return;
            }
            var columnID = column.id || column.db_id;
            this.$('.o_kanban_mobile_tab.o_current, .o_kanban_group.o_current')
                .removeClass('o_current');
            this.$('.o_kanban_group[data-id="' + columnID + '"], ' +
                   '.o_kanban_mobile_tab[data-id="' + columnID + '"]')
                .addClass('o_current');
        }
    },
    _computeTabPosition() {
        this._computeTabJustification();
        this._computeTabScrollPosition();
    },
    _computeTabScrollPosition() {
        if (this.widgets.length) {
            var lastItemIndex = this.widgets.length - 1;
            var moveToIndex = this.activeColumnIndex;
            var scrollToLeft = 0;
            for (var i = 0; i < moveToIndex; i++) {
                var columnWidth = this._getTabWidth(this.widgets[i]);
                if (moveToIndex !== lastItemIndex && i === moveToIndex - 1) {
                    var partialWidth = 0.75;
                    scrollToLeft += columnWidth * partialWidth;
                } else {
                    scrollToLeft += columnWidth;
                }
            }
            this.$('.o_kanban_mobile_tabs').scrollLeft(scrollToLeft);
        }
    },
    _computeTabJustification() {
        if (this.widgets.length) {
            var self = this;
            var widthChilds = this.widgets.reduce(function (total, column) {
                return total + self._getTabWidth(column);
            }, 0);
            var $tabs = this.$('.o_kanban_mobile_tabs');
            $tabs.toggleClass('justify-content-between', $tabs.outerWidth() >= widthChilds);
        }
    },
    _enableSwipe() {
        var self = this;
        var step = _t.database.parameters.direction === 'rtl' ? -1 : 1;
        this.$el.swipe({
            excludedElements: ".o_kanban_mobile_tabs",
            swipeLeft() {
                var moveToIndex = self.activeColumnIndex + step;
                if (moveToIndex < self.widgets.length) {
                    self._moveToGroup(moveToIndex, self.ANIMATE);
                }
            },
            swipeRight() {
                var moveToIndex = self.activeColumnIndex - step;
                if (moveToIndex > -1) {
                    self._moveToGroup(moveToIndex, self.ANIMATE);
                }
            }
        });
    },
    _getTabWidth (column) {
        var columnID = column.id || column.db_id;
        return this.$('.o_kanban_mobile_tab[data-id="' + columnID + '"]').outerWidth();
    },
    _layoutUpdate (animate) {
        this._computeCurrentColumn();
        this._computeTabPosition();
        this._computeColumnPosition(animate);
    },
    _moveToGroup(moveToIndex, animate) {
        if (moveToIndex < 0 || moveToIndex >= this.widgets.length) {
            this._layoutUpdate(animate);
            return Promise.resolve();
        }
        this.activeColumnIndex = moveToIndex;
        var column = this.widgets[this.activeColumnIndex];
        if (column.data.isOpen) {
            this._layoutUpdate(animate);
        } else {
            this.trigger_up('column_toggle_fold', {
                db_id: column.db_id,
                onSuccess: () => this._layoutUpdate(animate)
            });
        }
        this._enableSwipe();
        return Promise.resolve();
    },
    _renderGrouped(fragment) {
        var self = this;
        var newFragment = document.createDocumentFragment();
        this._super.apply(this, [newFragment]);
        this.defs.push(Promise.all(this.defs).then(function () {
            var data = [];
            _.each(self.state.data, function (group) {
                if (!group.value) {
                    group = _.extend({}, group, {value: _t('Undefined')});
                    data.unshift(group);
                } else {
                    data.push(group);
                }
            });

            var kanbanColumnContainer = document.createElement('div');
            kanbanColumnContainer.classList.add('o_kanban_columns_content');
            kanbanColumnContainer.appendChild(newFragment);
            fragment.appendChild(kanbanColumnContainer);
            $(qweb.render('KanbanView.MobileTabs', {
                data: data,
                quickCreateEnabled: self._canCreateColumn()
            })).prependTo(fragment);
        }));
    },
    _renderView() {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            if (self.state.groupedBy.length) {
                return self._moveToGroup(0);
            } else {
                if(self._canCreateColumn()) {
                    self._onMobileQuickCreateClicked();
                }
                return Promise.resolve();
            }
        });
    },
    _toNode(widgets) {
        const selectorCss = widgets
            .map(widget => '.o_kanban_group[data-id="' + (widget.id || widget.db_id) + '"]')
            .join(', ');
        return this.$(selectorCss);
    },
    _updateColumnCss($column, cssProperties, animate) {
        if (animate) {
            return new Promise(resolve => $column.animate(cssProperties, 'fast', resolve));
        } else {
            $column.css(cssProperties);
            return Promise.resolve();
        }
    },
    _onColumnAdded() {
        this._computeTabPosition();
        if(this._canCreateColumn() && !this.quickCreate.folded) {
            this.quickCreate.toggleFold();
        }
    },
    _onMobileQuickCreateClicked: function() {
        this.$('.o_kanban_group').toggle();
        this.quickCreate.toggleFold();
    },
    _onMobileTabClicked(event) {
        if(this._canCreateColumn() && !this.quickCreate.folded) {
            this.quickCreate.toggleFold();
        }
        this._moveToGroup($(event.currentTarget).index(), true);
    },
    _renderExampleBackground() {},
});

});