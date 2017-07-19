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

{
    "name": "MuK Preview Image",
    "summary": """Image Preview""",
    "description": """ 
        Extendes the Preview Dialog to support images.
        Currently the following image extensions are supported:
            - CIS-Cod-Dateien (*.cod, image/cis-cod)
            - CMU-Raster-Dateien (*.ras, image/cmu-raster)
            - FIF-Dateien (*.fif, image/fif)
            - GIF-Dateien (*.gif, image/gif)
            - IEF-Dateien (*.ief, image/ief)
            - JPEG-Dateien (*.jpeg *.jpg *.jpe, image/jpeg)
            - PNG-Dateien (*.png, image/png)
            - TIFF-Dateien (*.tiff *.tif, image/tiff)
            - Vasa-Dateien (*.mcf, image/vasa)
            - Bitmap-Dateien (WAP) (*.wbmp, image/vnd.wap.wbmp)
            - Freehand-Dateien (*.fh4 *.fh5 *.fhc, image/x-freehand)
            - Icon-Dateien (*.ico, image/x-icon)
            - PBM Anymap Dateien (*.pnm, image/x-portable-anymap)
            - PBM Bitmap Dateien (*.pbm, image/x-portable-bitmap)
            - PBM Graymap Dateien (*.pgm, image/x-portable-graymap)
            - PBM Pixmap Dateien (*.ppm, image/x-portable-pixmap)
            - RGB-Dateien (*.rgb, image/x-rgb)
            - X-Windows Dump (*.xwd, image/x-windowdump)
            - XBM-Dateien (*.xbm, image/x-xbitmap)
            - XPM-Dateien (*.xpm, image/x-xpixmap)
    """,
    "version": "10.0.1.0.1",
    "category": "Extra Tools",
    "license": "AGPL-3",
    "website": "http://www.mukit.at",
    "author": "MuK IT",
    "contributors": [
        "Mathias Markl <mathias.markl@mukit.at>",
    ],
    "depends": [
        "muk_web_preview",
    ],
    "data": [
        "template/assets.xml",
    ],
    "demo": [
    ],
    "qweb": [
        "static/src/xml/*.xml",
    ],
    "images": [
        'static/description/banner.png'
    ],
    "external_dependencies": {
        "python": [],
        "bin": [],
    },
    "application": False,
    "installable": True,
    
}