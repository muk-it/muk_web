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

from odoo import api, fields, models

_logger = logging.getLogger(__name__)

class NotifyWizard(models.TransientModel):
    
    _name = "muk_web_client_notification.send_notifications"
    
    def _default_user_ids(self):
        user_ids = self._context.get('active_model') == 'res.users' and self._context.get('active_ids') or []
        return [(6, 0, user_ids)]
    
    user_ids = fields.Many2many(
        comodel_name='res.users',
        relation='muk_web_client_notification_user_rel',
        column1='wizard_id',
        column2='user_id',
        string='Users',
        default=_default_user_ids,
        help="If no user is selected, the message is sent globally to all users.")
    
    type = fields.Selection(
        selection=[('info', 'Information'), ('warning', 'Warning')],
        string='Type',
        required=True,
        default='info')
    
    title = fields.Char(
        string="Title",
        required=True)
    
    message = fields.Text(
        string="Message",
        required=True)
    
    sticky = fields.Boolean(
        string="Sticky")
    
    @api.multi
    def send_notifications(self):
        bus = self.env["bus.bus"]
        for record in self:
            bus.sendone("notify", {
                "type": record.type,
                "title": record.title,
                "message": record.message,
                "sticky": record.sticky,
                "ids": record.user_ids.mapped("id")})
        return {
            'type': 'ir.actions.act_window_close'
        }