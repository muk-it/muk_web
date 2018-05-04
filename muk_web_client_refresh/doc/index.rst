======================
MuK Web Client Refresh
======================

Adds a channel called "refresh" to the web client, which can be used to trigger
a view reload without refreshing the browser itself. Furthermore, it allows the
user the creation of action rules. These rules can be applied to any model and
trigger a refresh either on create, update or unlink.

Installation
============

To install this module, you need to:

Download the module and add it to your Odoo addons folder. Afterward, log on to
your Odoo server and go to the Apps menu. Trigger the debug modus and update the
list by clicking on the "Update Apps List" link. Now install the module by
clicking on the install button.

Configuration
=============

To configure this module, you need to:

#. Go to *Settings* while being in debug mode.
#. Afterwards go to *Technical -> Automation -> Automated Refresh*.
#. And create a new refresh action.

Usage
=============

Besides creating a action rule, a view refresh can be triggered manually via python.
This can be useful if there is a need for a view reload on other operations.

Credits
=======

Contributors
------------

* Mathias Markl <mathias.markl@mukit.at>

Author & Maintainer
-------------------

This module is maintained by the `MuK IT GmbH <https://www.mukit.at/>`_.

MuK IT is an Austrian company specialized in customizing and extending Odoo.
We develop custom solutions for your individual needs to help you focus on
your strength and expertise to grow your business.

If you want to get in touch please contact us via mail
(sale@mukit.at) or visit our website (https://mukit.at).
