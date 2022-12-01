/** @odoo-module **/

import { Component, useState, useExternalListener } from "@odoo/owl";
import { computeAppsAndMenuItems } from "@web/webclient/menus/menu_helpers";
import { useAutofocus, useService } from '@web/core/utils/hooks';
import { useHotkey } from '@web/core/hotkeys/hotkey_hook';
import { fuzzyLookup } from '@web/core/utils/search';
import { debounce } from '@web/core/utils/timing';

export class AppsSearch extends Component {
	setup() {
    	super.setup();
        this.searchInput = useAutofocus();
    	this.state = useState({
            hasResults: false,
            results: [],
        });
        this.menuService = useService('menu');
		Object.assign(this, computeAppsAndMenuItems(
			this.menuService.getMenuAsTree('root')
		));
    	this._onInput = debounce(this._onInput, 100);
    }
	_onInput() {
		const query = this.searchInput.el.value;
        if (query !== '') {
            const results = [];
            fuzzyLookup(
        		query, this.apps, (menu) => {
        			return menu.label
        		}
            ).forEach((menu) => {
	            const result = {
	        		id: menu.id,
					name: menu.label,
					xmlid: menu.xmlid,
					appID: menu.appID,
					actionID: menu.actionID,
					action: () => this.menuService.selectMenu(menu),
	        		href: menu.href || `#menu_id=${menu.id}&amp;action_id=${menu.actionID}`,
	            };
	            if (menu.webIconData) {
	                const prefix = (
			        	menu.webIconData.startsWith('P') ? 
		    			'data:image/svg+xml;base64,' : 
						'data:image/png;base64,'
		            );
	                result.webIconData = (
		    			menu.webIconData.startsWith('data:image') ? 
						menu.webIconData : 
						prefix + menu.webIconData.replace(/\s/g, '')
		            );
	                result.style = `background-image:url("${result.webIconData}");`
	            }
	            results.push(result);
	        });
            fuzzyLookup(
            	query, this.menuItems, (menu) => {
	                return `${menu.parents} / ${menu.label}`.split('/').reverse().join('/')
	            }
            ).forEach((menu) => {
            	results.push({
	        		id: menu.id,
                    name: `${menu.parents} / ${menu.label}`,
					xmlid: menu.xmlid,
					appID: menu.appID,
					actionID: menu.actionID,
					action: () => this.menuService.selectMenu(menu),
                    href: menu.href || `#menu_id=${menu.id}&amp;action_id=${menu.actionID}`,
                });
            });
        	this.state.results = results;
            this.state.hasResults = true;
        } else {
        	this.state.results = [];
        	this.state.hasResults = false;
        }
    }
    _onKeyDown(ev) {
        if (ev.code === 'Escape') {
            ev.stopPropagation();
            ev.preventDefault();
            if (this.searchInput.el.value) {
                this.state.results = [];
                this.state.hasResults = false;
                this.searchInput.el.value = '';
            } else {
                this.env.bus.trigger('ACTION_MANAGER:UI-UPDATED');
            }
        }
    }
}

Object.assign(AppsSearch, {
    template: 'muk_web_theme.AppsSearch',
});

