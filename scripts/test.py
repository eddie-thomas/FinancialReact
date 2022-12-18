import sys
from WellsFargoPdfDocument import WellsFargoPdfDocumentBaseClass

if "__main__" == __name__:
    [_, path_to_pdf, type_of_document] = sys.argv
    PDF = WellsFargoPdfDocumentBaseClass(path_to_pdf, type_of_document)
    print(PDF.get_json())


# @see {https://pdfminersix.readthedocs.io/en/latest/reference/composable.html#laparams}
