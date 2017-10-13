# MuK Web Client Refresh

Adds a "refresh" channel to the web client,
which can be used to trigger a view refresh without refreshing the
browser itself. Furthermore, it allows the user the creation of
"refresh" rules. These rules can be applied to any Odoo model and
trigger a refresh either on create, write or unlink.

## Python Support

Besides creating a "refresh" rule, a view refresh can be triggered
manually via python. This can be useful if there is a need for a
view refresh on other operations like an action. 

```python
self.env['bus.bus'].sendone('refresh', self._name)
```