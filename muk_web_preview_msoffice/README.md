# MuK Preview MS Office

Extendes the Preview Dialog to support MS Office files. Currently the following file extensions are supported:

* Word (*.doc | *.docx, application/msword)
* Excel (*.xls | *.xlsx, application/msexcel)
* PowerPoint (*.ppt | *.pptx, application/mspowerpoint)

## Dependencies

### PDF Converter ([pdfconv](https://github.com/keshrath/pdfconv))

The Python library pdfconv can be used to convert a variety of different file types to PDF. It can be used on Windows as well as Linux.

### Windows

* MS Office [comtypes](http://starship.python.net/crew/theller/comtypes/)
* LibreOffice [unoconv](https://github.com/dagwieers/unoconv)

### Linux

* LibreOffice [unoconv](https://github.com/dagwieers/unoconv)
