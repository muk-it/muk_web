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

from odoo import _, api, models

_logger = logging.getLogger(__name__)

class ResUsers(models.Model):

    _inherit = 'res.users'

    @api.multi
    def _notify_channel(self, type, message, title=None, sticky=False):
        self.env["bus.bus"].sendone("notify", {
            "type": type,
            "title": title,
            "message": message,
            "sticky": sticky,
            "ids": self.mapped("id")})

    @api.multi
    def notify_info(self, message, title=None, sticky=False):
        title = title or _('Information')
        self._notify_channel("info", message, title, sticky)

    @api.multi
    def notify_warning(self, message, title=None, sticky=False):
        title = title or _('Warning')
        self._notify_channel("warning", message, title, sticky)
