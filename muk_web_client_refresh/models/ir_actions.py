###################################################################################
#
#    Copyright (c) 2017-2019 MuK IT GmbH.
#
#    This file is part of MuK Web Refresh 
#    (see https://mukit.at).
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
#    along with this program. If not, see <http://www.gnu.org/licenses/>.
#
###################################################################################

import logging

from datetime import datetime, timedelta
from collections import defaultdict

from odoo import api, models, fields

_logger = logging.getLogger(__name__)

REFRESH_BEAT = 55

class ServerActions(models.Model):
    
    _inherit = 'ir.actions.server'
    
    _last_refresh_timestamp = defaultdict(lambda: None)
    _in_memory_refresh = defaultdict(lambda: defaultdict(lambda: defaultdict(set)))

    #----------------------------------------------------------
    # Database
    #----------------------------------------------------------
    
    state = fields.Selection(
        selection_add=[('refresh', 'Refresh Views')])
    
    #----------------------------------------------------------
    # Functions
    #----------------------------------------------------------
    
    @api.model
    def run_action_refresh_multi(self, action, eval_context={}):
        if not self.env.context.get('refresh_disable', False) and \
                self.env.recompute and self.env.context.get('recompute', True):
            
            cls = type(self)
            dbname = self.env.cr.dbname
            now_timestamp = datetime.now()
            now_delta = now_timestamp - timedelta(seconds=REFRESH_BEAT)
            old_timestamp = cls._last_refresh_timestamp[dbname]
            
            record = eval_context.get('record', None)
            records = eval_context.get('records', None)

            if record and record._log_access and record.create_date == record.write_date:
                cls._in_memory_refresh[dbname][action.model_name][self.env.uid].add(True)
            else:
                cls._in_memory_refresh[dbname][action.model_name][self.env.uid].update(record and record.ids or [])
                cls._in_memory_refresh[dbname][action.model_name][self.env.uid].update(records and records.ids or [])
            
            if not old_timestamp or old_timestamp < now_delta:
                cls._last_refresh_timestamp[dbname] = now_timestamp
                for model, data in cls._in_memory_refresh[dbname].items():
                    for user, ids in data.items():
                        create = False
                        if True in ids:
                            ids.remove(True)
                            create = True
                        self.env['bus.bus'].sendone('refresh', {
                            'uid': user,
                            'model': model,
                            'ids': list(ids),
                            'create': create,
                        })
                cls._in_memory_refresh = defaultdict(lambda: defaultdict(lambda: defaultdict(set)))
