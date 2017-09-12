# -*- coding: utf-8 -*-

###################################################################################
#
#    Copyright (C) 2017 MuK IT GmbH
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###################################################################################

import logging

from odoo import _
from odoo import models, modules, api, fields
from odoo.exceptions import ValidationError, AccessError

_logger = logging.getLogger(__name__)

class RefreshRule(models.Model):
    _name = 'muk_web_client_refresh.rule'
    _description = "Auto Refresh Rule"

    name = fields.Char(
        string="Name",
        required=True)
    
    model = fields.Many2one(
        'ir.model',
        string="Model",
        required=True,
        help="Select model for which you want to refresh the corresponding views.")
    
    refresh_create = fields.Boolean(
        string="Refresh on Create", 
        default=True)
    
    refresh_write = fields.Boolean(
        string="Refresh on Writes", 
        default=True)
    
    refresh_unlink = fields.Boolean(
        string="Refresh on Unlink", 
        default=True)

    _sql_constraints = [
        ('model_uniq', 'unique(model)',
        ("There is already a rule defined on this model."))
    ]

    def _register_hook(self):
        super(RefreshRule, self)._register_hook()
        return self._patch_methods()

    @api.multi
    def _patch_methods(self):
        for rule in self:
            model = self.env[rule.model.model]
            if rule.refresh_create and not hasattr(model, "rule_refresh_create"):
                model._patch_method('create', rule._make_create())
                setattr(type(model), "rule_refresh_create", True)
            if rule.refresh_write and not hasattr(model, "rule_refresh_write"):
                model._patch_method('write', rule._make_write())
                setattr(type(model), "rule_refresh_write", True)
            if rule.refresh_unlink and not hasattr(model, "rule_refresh_unlink"):
                model._patch_method('unlink', rule._make_unlink())
                setattr(type(model), "rule_refresh_unlink", True)
           
    @api.multi
    def _revert_methods(self):
        for rule in self:
            model = self.env[rule.model._name]
            for method in ['create', 'write', 'unlink']:
                if getattr(rule, 'refresh_%s' % method) and hasattr(getattr(model, method), 'origin'):
                    model._revert_method(method)
                    delattr(type(model), 'refresh_ruled_%s' % method)
            
    @api.model
    def create(self, vals):
        record = super(RefreshRule, self).create(vals)
        record._register_hook()
        modules.registry.RegistryManager.signal_registry_change(self.env.cr.dbname)
        return record

    @api.multi
    def write(self, vals):
        super(RefreshRule, self).write(vals)
        self._register_hook()
        modules.registry.RegistryManager.signal_registry_change(self.env.cr.dbname)
        return True

    @api.multi
    def unlink(self):
        self._revert_methods()
        modules.registry.RegistryManager.signal_registry_change(self.env.cr.dbname)
        return super(RefreshRule, self).unlink()
    
    @api.multi
    def _make_create(self):
        @api.model
        @api.returns('self', lambda value: value.id)
        def create_refresh(self, vals, **kwargs):
            result = create_refresh.origin(self, vals, **kwargs)
            self.env['bus.bus'].sendone("%s_refresh" % self.env.cr.dbname, self._name)
            return result
        return create_refresh

    @api.multi
    def _make_write(self):
        @api.multi
        def write_refresh(self, vals, **kwargs):
            result = write_refresh.origin(self, vals, **kwargs)
            self.env['bus.bus'].sendone("%s_refresh" % self.env.cr.dbname, self._name)
            return result
        return write_refresh
    
    @api.multi
    def _make_unlink(self):
        @api.multi
        def unlink_refresh(self, **kwargs):
            result = unlink_refresh.origin(self, **kwargs)
            self.env['bus.bus'].sendone("%s_refresh" % self.env.cr.dbname, self._name)
            return result
        return unlink_refresh