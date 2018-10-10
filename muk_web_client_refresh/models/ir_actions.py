###################################################################################
#
#    Copyright (C) 2018 MuK IT GmbH
#
#    Odoo Proprietary License v1.0
#    
#    This software and associated files (the "Software") may only be used 
#    (executed, modified, executed after modifications) if you have
#    purchased a valid license from the authors, typically via Odoo Apps,
#    or if you have received a written agreement from the authors of the
#    Software (see the COPYRIGHT file).
#    
#    You may develop Odoo modules that use the Software as a library 
#    (typically by depending on it, importing it and using its resources),
#    but without copying any source code or material from the Software.
#    You may distribute those modules under the license of your choice,
#    provided that this license is compatible with the terms of the Odoo
#    Proprietary License (For example: LGPL, MIT, or proprietary licenses
#    similar to this one).
#    
#    It is forbidden to publish, distribute, sublicense, or sell copies of
#    the Software or modified copies of the Software.
#    
#    The above copyright notice and this permission notice must be included
#    in all copies or substantial portions of the Software.
#    
#    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
#    OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
#    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
#    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
#    DEALINGS IN THE SOFTWARE.
#
###################################################################################

import logging

from odoo import api, models, fields

_logger = logging.getLogger(__name__)

class ServerActions(models.Model):
    
    _inherit = 'ir.actions.server'

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
        record = eval_context.get('record', None)
        records = eval_context.get('records', None)
        self.env["bus.bus"].sendone("refresh", {
            "uid": self.env.uid,
            "model": action.model_name,
            "ids": list(set().union(record and record.ids or [], records and records.ids or [])),
            "create": record and record.exists() and record.create_date == record.write_date,
        })